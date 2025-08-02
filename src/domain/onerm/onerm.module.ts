import { Module } from '@nestjs/common';
import { OnermService } from './service/onerm.service';
import { OnermController } from './controller/onerm.controller';

@Module({
  controllers: [OnermController],
  providers: [OnermService],
})
export class OnermModule {}
