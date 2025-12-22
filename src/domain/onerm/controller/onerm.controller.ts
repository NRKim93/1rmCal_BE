import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OnermService } from '../service/onerm.service';

interface CalculateRequest {
  weight: number;
  reps: number;
}

interface OnermCalculatingResult {
  oneRm: number;
  repsTable: Array<{ reps: number; weight: number }>;
}

@Controller('/api/v1/onerm')
export class OnermController {
  constructor(private readonly service: OnermService) {}

  @Post('/cal')
  calculate(@Body() request: CalculateRequest): OnermCalculatingResult {
    const { weight, reps } = request;

    if (isNaN(weight) || isNaN(reps)) {
      throw new BadRequestException('숫자만 입력 가능합니다.');
    }

    if (weight <= 0 || reps <= 0) {
      throw new BadRequestException('무게와 횟수는 0보다 커야 합니다.');
    }

    if (reps > 20) {
      throw new BadRequestException('반복 횟수는 20회 이하여야 합니다.');
    }

    return this.service.calculating(weight, reps);
  }
}
