import { Module } from '@nestjs/common';
import { OnermService } from './service/OnermService';
import { OnermController } from './controller/OnermController';

@Module({
  controllers: [OnermController],
  providers: [OnermService],
})
export class OnermModule {}
