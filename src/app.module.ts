import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/onerm.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/users/users.module';
import {AuthModule} from "./domain/auth/auth.module";
import { RedisModule } from './common/infra/redis/redis.module';
import { RedisService } from './common/service/redis/redis.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OnermModule,
    UsersModule,
    AuthModule,
    RedisModule
  ],
  providers: [RedisService],
})
export class AppModule {}
