import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTrainingProgramDayDto,
  CreateTrainingProgramExerciseDto,
  CreateTrainingProgramRequestDto,
  CreateTrainingProgramWeekDto,
} from '../dto/create-training-program.dto';
import { TrainingProgramRepository } from '../repository/training-program.repository';
import { TrainingProgramService } from './training-program.service';

type CreateProgramMethod = TrainingProgramRepository['create'];
type FindActiveProgramMethod = TrainingProgramRepository['findActive'];
type StartProgramMethod = TrainingProgramRepository['start'];

function createRequest(): CreateTrainingProgramRequestDto {
  return {
    code: 'STRONG_LIFTS_5X5',
    name: '스트롱리프트 5x5',
    description: '전신 근력 프로그램',
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
                trainingCategorySeq: 1,
                exerciseOrder: 1,
                targetSets: 5,
                targetRepsMin: 5,
                targetRepsMax: 5,
                restSeconds: 180,
                targetWeightRate: 75,
              },
            ],
          },
        ],
      },
    ],
  };
}

function getFirstWeek(
  request: CreateTrainingProgramRequestDto,
): CreateTrainingProgramWeekDto {
  const [week] = request.weeks;
  if (!week) {
    throw new Error('test fixture must contain a program week');
  }
  return week;
}

function getFirstDay(
  request: CreateTrainingProgramRequestDto,
): CreateTrainingProgramDayDto {
  const [day] = getFirstWeek(request).days;
  if (!day) {
    throw new Error('test fixture must contain a program day');
  }
  return day;
}

function getFirstExercise(
  day: CreateTrainingProgramDayDto,
): CreateTrainingProgramExerciseDto {
  const [exercise] = day.exercises;
  if (!exercise) {
    throw new Error('test fixture must contain an exercise');
  }
  return exercise;
}

describe('TrainingProgramService', () => {
  let service: TrainingProgramService;
  const repository: jest.Mocked<
    Pick<TrainingProgramRepository, 'create' | 'findActive' | 'start'>
  > = {
    create: jest.fn<
      ReturnType<CreateProgramMethod>,
      Parameters<CreateProgramMethod>
    >(),
    findActive: jest.fn<
      ReturnType<FindActiveProgramMethod>,
      Parameters<FindActiveProgramMethod>
    >(),
    start: jest.fn<
      ReturnType<StartProgramMethod>,
      Parameters<StartProgramMethod>
    >(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingProgramService,
        {
          provide: TrainingProgramRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get(TrainingProgramService);
  });

  it('registers a valid program', async () => {
    const request = createRequest();
    const createdProgram: Awaited<ReturnType<CreateProgramMethod>> = {
      seq: 1,
      code: request.code,
      name: request.name,
      description: '전신 근력 프로그램',
      version: request.version,
      owner_user_seq: 1,
      is_active: request.isActive,
      is_public: request.isPublic,
      source_program_seq: null,
      created_at: new Date('2026-07-19T00:00:00Z'),
      updated_at: new Date('2026-07-19T00:00:00Z'),
      training_program_days: [],
    };
    repository.create.mockResolvedValue(createdProgram);

    const result = await service.create(1, request);

    expect(result).toMatchObject({
      seq: 1,
      code: request.code,
      isActive: true,
      weeks: [],
    });
    expect(repository.create).toHaveBeenCalledWith(1, request);
  });

  it('returns active programs in the create response shape', async () => {
    const request = createRequest();
    repository.findActive.mockResolvedValue([
      {
        seq: 1,
        code: request.code,
        name: request.name,
        description: request.description ?? null,
        version: request.version,
        owner_user_seq: 1,
        is_active: true,
        is_public: false,
        source_program_seq: null,
        created_at: new Date('2026-07-19T00:00:00Z'),
        updated_at: new Date('2026-07-19T00:00:00Z'),
        user_programs: [],
        training_program_days: [],
      },
    ]);

    await expect(service.findActive(1)).resolves.toEqual([
      expect.objectContaining({
        seq: 1,
        code: request.code,
        name: request.name,
        isActive: true,
        progress: expect.objectContaining({
          status: 'NOT_STARTED',
          completedSessions: 0,
          totalSessions: 0,
          percentage: 0,
        }),
        weeks: [],
      }),
    ]);
    expect(repository.findActive).toHaveBeenCalledWith(1, undefined);
  });

  it('returns the current session when a user starts a program', async () => {
    const programDay = {
      seq: 10,
      program_seq: 1,
      week_order: 1,
      day_order: 1,
      name: 'Workout A',
      training_program_exercises: [
        {
          seq: 100,
          program_day_seq: 10,
          training_category_seq: 3,
          one_rm_reference_category_seq: null,
          exercise_order: 1,
          target_sets: 5,
          target_reps_min: 5,
          target_reps_max: 8,
          rest_seconds: 180,
          target_weight_rate: new Prisma.Decimal(75),
          training_category: {
            seq: 3,
            training_name: 'BENCHPRESS',
            training_display_name: '벤치프레스',
          },
          one_rm_reference_category: null,
        },
        {
          seq: 101,
          program_day_seq: 10,
          training_category_seq: 4,
          one_rm_reference_category_seq: 3,
          exercise_order: 2,
          target_sets: 3,
          target_reps_min: 10,
          target_reps_max: 12,
          rest_seconds: 90,
          target_weight_rate: new Prisma.Decimal(30),
          training_category: {
            seq: 4,
            training_name: 'PECDECFLY',
            training_display_name: '펙 덱 플라이',
          },
          one_rm_reference_category: {
            seq: 3,
            training_name: 'BENCHPRESS',
            training_display_name: '벤치프레스',
          },
        },
      ],
    };
    repository.start.mockResolvedValue({
      userProgram: {
        seq: 20,
        user_seq: 1,
        program_seq: 1,
        status: 'ACTIVE',
        current_week: 1,
        current_day: 1,
        completed_sessions: 0,
        started_at: new Date('2026-07-20T00:00:00Z'),
        completed_at: null,
      },
      program: {
        seq: 1,
        code: 'TEST',
        name: '테스트 프로그램',
        description: null,
        version: 1,
        owner_user_seq: 1,
        is_active: true,
        is_public: false,
        source_program_seq: null,
        created_at: new Date('2026-07-20T00:00:00Z'),
        updated_at: new Date('2026-07-20T00:00:00Z'),
        training_program_days: [programDay],
      },
      programDay,
      oneRmRecords: [
        {
          seq: 1,
          author: '1',
          training_name: '벤치프레스',
          weight: new Prisma.Decimal(100),
          unit: 'KG',
          source_weight: new Prisma.Decimal(85),
          source_reps: 5,
          createdAt: new Date('2026-07-20T00:00:00Z'),
        },
        {
          seq: 2,
          author: '1',
          training_name: 'BENCHPRESS',
          weight: new Prisma.Decimal(90),
          unit: 'KG',
          source_weight: new Prisma.Decimal(80),
          source_reps: 4,
          createdAt: new Date('2026-07-19T00:00:00Z'),
        },
      ],
    });

    await expect(service.start(1, 1)).resolves.toMatchObject({
      userProgramSeq: 20,
      currentWeek: 1,
      currentDay: 1,
      programDaySeq: 10,
      exercises: [
        {
          trainingCategorySeq: 3,
          trainingDisplayName: '벤치프레스',
          targetSets: 5,
          targetRepsMin: 5,
          targetRepsMax: 8,
          oneRmSupported: true,
          oneRmWeight: 100,
          oneRmUnit: 'KG',
          estimatedWeight: 75,
        },
        {
          trainingCategorySeq: 4,
          trainingDisplayName: '펙 덱 플라이',
          targetWeightRate: 30,
          oneRmSupported: true,
          oneRmReferenceTrainingDisplayName: '벤치프레스',
          oneRmWeight: 100,
          oneRmUnit: 'KG',
          estimatedWeight: 30,
        },
      ],
    });
    expect(repository.start).toHaveBeenCalledWith(1, 1);
  });

  it('rejects duplicate week positions', async () => {
    const request = createRequest();
    const firstWeek = getFirstWeek(request);
    request.weeks.push({ ...firstWeek });

    await expect(service.create(1, request)).rejects.toThrow(BadRequestException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects duplicate day positions in a week', async () => {
    const request = createRequest();
    const firstWeek = getFirstWeek(request);
    const firstDay = getFirstDay(request);
    firstWeek.days.push({ ...firstDay, name: '중복 회차' });

    await expect(service.create(1, request)).rejects.toThrow(
      'duplicate program day',
    );
  });

  it('rejects duplicate exercise orders in a day', async () => {
    const request = createRequest();
    const firstDay = getFirstDay(request);
    const firstExercise = getFirstExercise(firstDay);
    firstDay.exercises.push({
      ...firstExercise,
      trainingCategorySeq: 2,
    });

    await expect(service.create(1, request)).rejects.toThrow(
      'duplicate exercise order',
    );
  });

  it('rejects duplicate training categories in a day', async () => {
    const request = createRequest();
    const firstDay = getFirstDay(request);
    const firstExercise = getFirstExercise(firstDay);
    firstDay.exercises.push({
      ...firstExercise,
      exerciseOrder: 2,
    });

    await expect(service.create(1, request)).rejects.toThrow(
      'duplicate training category',
    );
  });

  it('rejects an inverted target repetition range', async () => {
    const request = createRequest();
    const firstExercise = getFirstExercise(getFirstDay(request));
    firstExercise.targetRepsMin = 8;
    firstExercise.targetRepsMax = 5;

    await expect(service.create(1, request)).rejects.toThrow(
      'targetRepsMin cannot exceed targetRepsMax',
    );
  });
});
