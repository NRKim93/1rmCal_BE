import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/onerm.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { RedisModule } from './common/infra/redis/redis.module';
import { RedisService } from './common/service/redis/redis.service';
import { TrainingController } from './domain/training/controller/training.controller';
import { TrainingService } from './domain/training/service/training.service';
import { TrainingModule } from './domain/training/training.module';
import { TrainingProgramModule } from './domain/training-program/training-program.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OnermModule,
    UsersModule,
    AuthModule,
    RedisModule,
    TrainingModule,
    TrainingProgramModule,
  ],
  providers: [RedisService, TrainingService],
  controllers: [TrainingController],
})
export class AppModule {}
