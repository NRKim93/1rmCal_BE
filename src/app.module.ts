import { Module } from '@nestjs/common';
import { OnermModule } from './domain/onerm/OnermModule';

@Module({
  imports: [OnermModule],
})
export class AppModule {}
