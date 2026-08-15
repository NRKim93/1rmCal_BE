import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/service/PrismaService';
import {
  CreateTrainingProgramRequestDto,
  CreateTrainingProgramVersionRequestDto,
} from '../dto/create-training-program.dto';
import { TrainingProgramRepository } from './training-program.repository';

type ProgramCreateArgument = {
  data: {
    code: string;
    version: number;
    training_program_days: unknown;
  };
};

function createRequest(): CreateTrainingProgramRequestDto {
  return {
    code: 'STRONG_LIFTS_5X5',
    name: '스트롱리프트 5x5',
    version: 1,
    isActive: true,
    isPublic: false,
    weeks: [
      {
        weekOrder: 1,
        days: [
          {
            dayOrder: 1,
            name: 'Workout A',
            exercises: [
              {
                trainingCategorySeq: 10,
                exerciseOrder: 1,
                targetSets: 5,
                targetRepsMin: 5,
                targetRepsMax: 5,
              },
            ],
          },
        ],
      },
    ],
  };
}

describe('TrainingProgramRepository', () => {
  const tx = {
    users: {
      findUnique: jest.fn(),
    },
    training_program: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn<Promise<unknown>, [ProgramCreateArgument]>(),
    },
    training_category: {
      findMany: jest.fn(),
    },
    user_training_program: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    onerm: {
      findMany: jest.fn(),
    },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) =>
      callback(tx),
    ),
    training_program: {
      findMany: jest.fn(),
    },
  };
  const repository = new TrainingProgramRepository(
    prisma as unknown as PrismaService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a program and all children in one transaction', async () => {
    const request = createRequest();
    const created = { seq: 1, code: request.code, version: request.version };
    tx.training_program.findFirst.mockResolvedValue(null);
    tx.training_category.findMany.mockResolvedValue([{ seq: 10 }]);
    tx.training_program.create.mockResolvedValue(created);

    await expect(repository.create(7, request)).resolves.toEqual(created);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.training_program.create).toHaveBeenCalledTimes(1);
    const createArgument = tx.training_program.create.mock.calls[0]?.[0];
    expect(createArgument).toMatchObject({
      data: {
        code: request.code,
        version: request.version,
      },
    });
  });

  it('creates the next version and deactivates the previous active version', async () => {
    const { code: _code, version: _version, ...request } = createRequest();
    const versionRequest: CreateTrainingProgramVersionRequestDto = request;
    const created = { seq: 2, code: 'STRONG_LIFTS_5X5', version: 2 };
    tx.training_program.findUnique.mockResolvedValue({
      code: 'STRONG_LIFTS_5X5',
      owner_user_seq: 7,
    });
    tx.training_program.findFirst.mockResolvedValue({ version: 1 });
    tx.training_category.findMany.mockResolvedValue([{ seq: 10 }]);
    tx.training_program.updateMany.mockResolvedValue({ count: 1 });
    tx.training_program.create.mockResolvedValue(created);

    await expect(repository.createVersion(1, 7, versionRequest)).resolves.toEqual(
      created,
    );
    expect(tx.training_program.updateMany).toHaveBeenCalledWith({
      where: {
        code: 'STRONG_LIFTS_5X5',
        owner_user_seq: 7,
        is_active: true,
      },
      data: { is_active: false },
    });
    expect(tx.training_program.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          code: 'STRONG_LIFTS_5X5',
          version: 2,
        }),
      }),
    );
  });

  it('rejects a new version when the requester does not own the source', async () => {
    const { code: _code, version: _version, ...request } = createRequest();
    tx.training_program.findUnique.mockResolvedValue({
      code: 'APRO',
      owner_user_seq: 1,
    });

    await expect(repository.createVersion(1, 2, request)).rejects.toThrow(
      ForbiddenException,
    );
    expect(tx.training_program.create).not.toHaveBeenCalled();
  });

  it('downloads a public program as an independent private copy', async () => {
    const source = {
      seq: 11,
      owner_user_seq: 1,
      code: 'APRO',
      name: 'Apro',
      description: 'shared program',
      version: 3,
      is_active: true,
      is_public: true,
      training_program_days: [
        {
          week_order: 1,
          day_order: 1,
          name: 'Day 1',
          training_program_exercises: [
            {
              training_category_seq: 10,
              one_rm_reference_category_seq: null,
              exercise_order: 1,
              target_sets: 5,
              target_reps_min: 5,
              target_reps_max: 5,
              rest_seconds: 180,
              target_weight_rate: null,
            },
          ],
        },
      ],
    };
    const downloaded = { seq: 21, owner_user_seq: 2, code: 'APRO' };
    tx.training_program.findFirst
      .mockResolvedValueOnce(source)
      .mockResolvedValueOnce(null);
    tx.training_program.create.mockResolvedValue(downloaded);

    await expect(repository.download(11, 2)).resolves.toEqual(downloaded);
    expect(tx.training_program.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          owner_user_seq: 2,
          source_program_seq: 11,
          code: 'APRO',
          version: 1,
          is_active: true,
          is_public: false,
        }),
      }),
    );
  });

  it('returns active programs with ordered days and exercises', async () => {
    prisma.training_program.findMany.mockResolvedValue([]);

    await expect(repository.findActive(7)).resolves.toEqual([]);
    expect(prisma.training_program.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { owner_user_seq: 7, is_active: true },
            {
              user_programs: {
                some: { user_seq: 7, status: 'ACTIVE' },
              },
            },
          ],
        },
        orderBy: [{ created_at: 'desc' }, { seq: 'desc' }],
      }),
    );
  });

  it('allows an in-progress user to resume an inactive program version', async () => {
    const programDay = {
      seq: 101,
      week_order: 1,
      day_order: 1,
      training_program_exercises: [],
    };
    const program = {
      seq: 1,
      is_active: false,
      training_program_days: [programDay],
    };
    const userProgram = {
      seq: 201,
      user_seq: 7,
      program_seq: 1,
      status: 'ACTIVE',
      current_week: 1,
      current_day: 1,
    };
    tx.users.findUnique.mockResolvedValue({ seq: 7 });
    tx.training_program.findFirst.mockResolvedValue(program);
    tx.user_training_program.findFirst.mockResolvedValue(userProgram);

    await expect(repository.start(1, 7)).resolves.toEqual({
      userProgram,
      program,
      programDay,
      oneRmRecords: [],
    });
    expect(tx.training_program.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          seq: 1,
          OR: [
            { owner_user_seq: 7, is_active: true },
            {
              user_programs: {
                some: { user_seq: 7, status: 'ACTIVE' },
              },
            },
          ],
        },
      }),
    );
  });

  it('rejects an existing code and version', async () => {
    tx.training_program.findFirst.mockResolvedValue({ seq: 1 });

    await expect(repository.create(7, createRequest())).rejects.toThrow(
      ConflictException,
    );
    expect(tx.training_program.create).not.toHaveBeenCalled();
  });

  it('rejects missing training categories', async () => {
    tx.training_program.findFirst.mockResolvedValue(null);
    tx.training_category.findMany.mockResolvedValue([]);

    await expect(repository.create(7, createRequest())).rejects.toThrow(
      BadRequestException,
    );
    expect(tx.training_program.create).not.toHaveBeenCalled();
  });
});
