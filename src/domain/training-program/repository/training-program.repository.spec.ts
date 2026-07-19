import { BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../common/service/PrismaService';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';
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
    days: [
      {
        weekOrder: 1,
        dayOrder: 1,
        name: '1주차 A',
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
  };
}

describe('TrainingProgramRepository', () => {
  const tx = {
    training_program: {
      findUnique: jest.fn(),
      create: jest.fn<Promise<unknown>, [ProgramCreateArgument]>(),
    },
    training_category: {
      findMany: jest.fn(),
    },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => Promise<unknown>) =>
      callback(tx),
    ),
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
