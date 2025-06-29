import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/OnermModule';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './domain/users/UsersModule';

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
