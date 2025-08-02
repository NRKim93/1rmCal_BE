import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/onerm.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OnermModule,
    UsersModule,
  ],
})
export class AppModule {}
