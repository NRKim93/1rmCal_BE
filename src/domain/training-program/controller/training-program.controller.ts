import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '../../../common/rsData/RsData';
import { CreateTrainingProgramRequestDto } from '../dto/create-training-program.dto';
import { TrainingProgramService } from '../service/training-program.service';

@ApiTags('training-programs')
@Controller('/api/v1/training-programs')
export class TrainingProgramController {
  constructor(private readonly service: TrainingProgramService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '정규 트레이닝 프로그램 등록' })
  async create(@Body() request: CreateTrainingProgramRequestDto) {
    const program = await this.service.create(request);
    return success(program);
  }
}
