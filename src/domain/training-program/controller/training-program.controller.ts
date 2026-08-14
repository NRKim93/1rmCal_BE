import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '../../../common/rsData/RsData';
import { JwtAuthGuard } from '../../../common/security/jwt/jwt.guard';
import {
  CreateTrainingProgramRequestDto,
  CreateTrainingProgramVersionRequestDto,
} from '../dto/create-training-program.dto';
import { StartTrainingProgramRequestDto } from '../dto/start-training-program.dto';
import { TrainingProgramService } from '../service/training-program.service';

@ApiTags('training-programs')
@Controller('/api/v1/training-programs')
export class TrainingProgramController {
  constructor(private readonly service: TrainingProgramService) {}

  @Get('active')
  @ApiOperation({ summary: '활성 트레이닝 프로그램 목록 조회' })
  async findActive(@Query('userSeq') userSeq?: string) {
    const parsedUserSeq = userSeq === undefined ? undefined : Number(userSeq);
    if (
      parsedUserSeq !== undefined &&
      (!Number.isInteger(parsedUserSeq) || parsedUserSeq < 1)
    ) {
      throw new BadRequestException('userSeq must be a positive integer');
    }
    const programs = await this.service.findActive(parsedUserSeq);
    return success(programs);
  }

  @Get(':programSeq')
  @ApiOperation({ summary: '트레이닝 프로그램 단건 조회' })
  async findOne(@Param('programSeq', ParseIntPipe) programSeq: number) {
    const program = await this.service.findOne(programSeq);
    return success(program);
  }

  @Post(':programSeq/versions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '기존 프로그램을 기반으로 새 버전 생성' })
  async createVersion(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Body() request: CreateTrainingProgramVersionRequestDto,
  ) {
    const program = await this.service.createVersion(programSeq, request);
    return success(program);
  }

  @Post(':programSeq/start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '사용자 트레이닝 프로그램 시작 또는 재개' })
  async start(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Body() request: StartTrainingProgramRequestDto,
  ) {
    const session = await this.service.start(programSeq, request.userSeq);
    return success(session);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '정규 트레이닝 프로그램 등록' })
  async create(@Body() request: CreateTrainingProgramRequestDto) {
    const program = await this.service.create(request);
    return success(program);
  }
}
