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
    training_history: {
      findMany: jest.fn(),
    },
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

  it('returns every exercise from its most recent session with all sets', async () => {
    prisma.training_history.findMany.mockResolvedValue([
      {
        training_seq: 20,
        training_category_seq: 3,
        name: 'Bench Press',
        weight: 80,
        weight_unit: 'kg',
        reps: 8,
        set_order: 1,
        training: {training_date: new Date('2026-08-17T00:00:00Z')},
      },
      {
        training_seq: 20,
        training_category_seq: 3,
        name: 'Bench Press',
        weight: 90,
        weight_unit: 'kg',
        reps: 5,
        set_order: 2,
        training: {training_date: new Date('2026-08-17T00:00:00Z')},
      },
      {
        training_seq: 10,
        training_category_seq: 3,
        name: 'Bench Press',
        weight: 70,
        weight_unit: 'kg',
        reps: 10,
        set_order: 1,
        training: {training_date: new Date('2026-07-20T00:00:00Z')},
      },
      {
        training_seq: 10,
        training_category_seq: 4,
        name: 'Squat',
        weight: 100,
        weight_unit: 'kg',
        reps: 5,
        set_order: 1,
        training: {training_date: new Date('2026-07-20T00:00:00Z')},
      },
    ]);

    await expect(repository.getLatestExerciseHistoryByUser(1)).resolves.toEqual([
      {
        trainingSeq: 20,
        trainingCategorySeq: 3,
        name: 'Bench Press',
        trainingDate: new Date('2026-08-17T00:00:00Z'),
        sets: [
          {setOrder: 1, weight: 80, weightUnit: 'kg', reps: 8},
          {setOrder: 2, weight: 90, weightUnit: 'kg', reps: 5},
        ],
      },
      {
        trainingSeq: 10,
        trainingCategorySeq: 4,
        name: 'Squat',
        trainingDate: new Date('2026-07-20T00:00:00Z'),
        sets: [{setOrder: 1, weight: 100, weightUnit: 'kg', reps: 5}],
      },
    ]);
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
