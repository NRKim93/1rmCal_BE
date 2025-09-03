import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/onerm.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/users/users.module';
import {AuthModule} from "./domain/auth/auth.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OnermModule,
    UsersModule,
    AuthModule
  ],
})
export class AppModule {}
