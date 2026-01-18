import { Module } from '@nestjs/common';
import { OnermService } from './service/onerm.service';
import { OnermController } from './controller/onerm.controller';
import { OnermRepository } from './repository/onerm.repository';
import { PrismaService } from 'src/common/service/PrismaService';

@Module({
  controllers: [OnermController],
  providers: [OnermService, OnermRepository,PrismaService],
  exports: [OnermRepository,PrismaService]
})
export class OnermModule {}
