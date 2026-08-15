import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/service/PrismaService';
import { TrainingProgramController } from './controller/training-program.controller';
import { TrainingProgramRepository } from './repository/training-program.repository';
import { TrainingProgramService } from './service/training-program.service';

@Module({
  controllers: [TrainingProgramController],
  providers: [
    TrainingProgramService,
    TrainingProgramRepository,
    PrismaService,
  ],
  exports: [TrainingProgramService],
})
export class TrainingProgramModule {}
