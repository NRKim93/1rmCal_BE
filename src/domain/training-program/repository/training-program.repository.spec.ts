import { BadRequestException, ConflictException } from '@nestjs/common';
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
    tx.training_program.findUnique.mockResolvedValue(null);
    tx.training_category.findMany.mockResolvedValue([{ seq: 10 }]);
    tx.training_program.create.mockResolvedValue(created);

    await expect(repository.create(request)).resolves.toEqual(created);
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
    });
    tx.training_program.findFirst.mockResolvedValue({ version: 1 });
    tx.training_category.findMany.mockResolvedValue([{ seq: 10 }]);
    tx.training_program.updateMany.mockResolvedValue({ count: 1 });
    tx.training_program.create.mockResolvedValue(created);

    await expect(repository.createVersion(1, versionRequest)).resolves.toEqual(
      created,
    );
    expect(tx.training_program.updateMany).toHaveBeenCalledWith({
      where: { code: 'STRONG_LIFTS_5X5', is_active: true },
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

  it('returns active programs with ordered days and exercises', async () => {
    prisma.training_program.findMany.mockResolvedValue([]);

    await expect(repository.findActive()).resolves.toEqual([]);
    expect(prisma.training_program.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { is_active: true },
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
            { is_active: true },
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
    tx.training_program.findUnique.mockResolvedValue({ seq: 1 });

    await expect(repository.create(createRequest())).rejects.toThrow(
      ConflictException,
    );
    expect(tx.training_program.create).not.toHaveBeenCalled();
  });

  it('rejects missing training categories', async () => {
    tx.training_program.findUnique.mockResolvedValue(null);
    tx.training_category.findMany.mockResolvedValue([]);

    await expect(repository.create(createRequest())).rejects.toThrow(
      BadRequestException,
    );
    expect(tx.training_program.create).not.toHaveBeenCalled();
  });
});
