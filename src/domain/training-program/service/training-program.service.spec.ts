import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTrainingProgramDayDto,
  CreateTrainingProgramExerciseDto,
  CreateTrainingProgramRequestDto,
} from '../dto/create-training-program.dto';
import { TrainingProgramRepository } from '../repository/training-program.repository';
import { TrainingProgramService } from './training-program.service';

type CreateProgramMethod = TrainingProgramRepository['create'];

function createRequest(): CreateTrainingProgramRequestDto {
  return {
    code: 'STRONG_LIFTS_5X5',
    name: '스트롱리프트 5x5',
    description: '전신 근력 프로그램',
    version: 1,
    isActive: true,
    days: [
      {
        weekOrder: 1,
        dayOrder: 1,
        name: '1주차 A',
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
  };
}

function getFirstDay(
  request: CreateTrainingProgramRequestDto,
): CreateTrainingProgramDayDto {
  const [day] = request.days;
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
  const repository: jest.Mocked<Pick<TrainingProgramRepository, 'create'>> = {
    create: jest.fn<
      ReturnType<CreateProgramMethod>,
      Parameters<CreateProgramMethod>
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
      is_active: request.isActive,
      created_at: new Date('2026-07-19T00:00:00Z'),
      updated_at: new Date('2026-07-19T00:00:00Z'),
      training_program_days: [],
    };
    repository.create.mockResolvedValue(createdProgram);

    const result = await service.create(request);

    expect(result).toMatchObject({
      seq: 1,
      code: request.code,
      isActive: true,
      days: [],
    });
    expect(repository.create).toHaveBeenCalledWith(request);
  });

  it('rejects duplicate week and day positions', async () => {
    const request = createRequest();
    const firstDay = getFirstDay(request);
    request.days.push({ ...firstDay, name: '중복 회차' });

    await expect(service.create(request)).rejects.toThrow(BadRequestException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('rejects duplicate exercise orders in a day', async () => {
    const request = createRequest();
    const firstDay = getFirstDay(request);
    const firstExercise = getFirstExercise(firstDay);
    firstDay.exercises.push({
      ...firstExercise,
      trainingCategorySeq: 2,
    });

    await expect(service.create(request)).rejects.toThrow(
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

    await expect(service.create(request)).rejects.toThrow(
      'duplicate training category',
    );
  });

  it('rejects an inverted target repetition range', async () => {
    const request = createRequest();
    const firstExercise = getFirstExercise(getFirstDay(request));
    firstExercise.targetRepsMin = 8;
    firstExercise.targetRepsMax = 5;

    await expect(service.create(request)).rejects.toThrow(
      'targetRepsMin cannot exceed targetRepsMax',
    );
  });
});
