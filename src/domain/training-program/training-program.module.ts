import { Module } from '@nestjs/common';
import { PrismaService } from '../../common/service/PrismaService';
import { JwtAuthGuard } from '../../common/security/jwt/jwt.guard';
import { JwtModule } from '../../common/security/jwt/jwt.module';
import { TrainingProgramController } from './controller/training-program.controller';
import { TrainingProgramRepository } from './repository/training-program.repository';
import { TrainingProgramService } from './service/training-program.service';

@Module({
  imports: [JwtModule],
  controllers: [TrainingProgramController],
  providers: [
    TrainingProgramService,
    TrainingProgramRepository,
    PrismaService,
    JwtAuthGuard,
  ],
  exports: [TrainingProgramService],
})
export class TrainingProgramModule {}
