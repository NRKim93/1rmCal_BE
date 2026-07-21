import { PrismaService } from '../../../common/service/PrismaService';
import { CreateTrainingRequestDto } from '../dto/training.dto';
import { TrainingRepository } from './training.repository';

describe('TrainingRepository program session', () => {
  const tx = {
    user_training_program: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    training_program_day: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    training: {
      create: jest.fn(),
    },
    training_history: {
      createMany: jest.fn(),
    },
  };
  const prisma = {
    $transaction: jest.fn(
      (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    ),
  };
  const repository = new TrainingRepository(
    prisma as unknown as PrismaService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores program references and advances to the next session', async () => {
    const request: CreateTrainingRequestDto = {
      mode: 'PROGRAM',
      userProgramSeq: 7,
      programDaySeq: 10,
      param: [
        {
          userSeq: 1,
          trainingCategorySeq: 3,
          name: '벤치프레스',
          weight: 80,
          weightUnit: 'kg',
          reps: 5,
          sets: 1,
          rest: '03:00',
          restSeconds: 180,
        },
      ],
    };
    tx.user_training_program.findFirst.mockResolvedValue({
      seq: 7,
      user_seq: 1,
      program_seq: 2,
      status: 'ACTIVE',
      current_week: 1,
      current_day: 1,
    });
    tx.training_program_day.findFirst.mockResolvedValue({
      seq: 10,
      program_seq: 2,
      week_order: 1,
      day_order: 1,
      training_program_exercises: [{ training_category_seq: 3 }],
    });
    tx.training.create.mockResolvedValue({ seq: 50, user_seq: 1 });
    tx.training_history.createMany.mockResolvedValue({ count: 1 });
    tx.training_program_day.findMany.mockResolvedValue([
      { seq: 10, week_order: 1, day_order: 1 },
      { seq: 11, week_order: 1, day_order: 2 },
    ]);
    tx.user_training_program.update.mockResolvedValue({ seq: 7 });

    await repository.createTraining(request);

    expect(tx.training.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        mode: 'PROGRAM',
        user_program_seq: 7,
        program_day_seq: 10,
      }),
    });
    expect(tx.training_history.createMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          training_category_seq: 3,
          set_order: 1,
          rest_seconds: 180,
        }),
      ],
    });
    expect(tx.user_training_program.update).toHaveBeenCalledWith({
      where: { seq: 7 },
      data: {
        current_week: 1,
        current_day: 2,
        completed_sessions: { increment: 1 },
      },
    });
  });
});
