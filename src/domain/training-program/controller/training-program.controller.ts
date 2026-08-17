import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '../../../common/rsData/RsData';
import { AuthenticatedRequest } from '../../../common/security/authenticated-request';
import {
  CreateTrainingProgramRequestDto,
  CreateTrainingProgramVersionRequestDto,
} from '../dto/create-training-program.dto';
import { TrainingProgramService } from '../service/training-program.service';

@ApiTags('training-programs')
@Controller('/api/v1/training-programs')
export class TrainingProgramController {
  constructor(private readonly service: TrainingProgramService) {}

  @Get('active')
  @ApiOperation({ summary: '내 활성 트레이닝 프로그램 목록 조회' })
  async findActive(
    @Req() req: AuthenticatedRequest,
    @Query('q') query?: string,
  ) {
    return success(await this.service.findActive(req.user.userSeq, query));
  }

  @Get('shared')
  @ApiOperation({ summary: '다른 사용자가 공개한 프로그램 목록 조회' })
  async findShared(
    @Req() req: AuthenticatedRequest,
    @Query('q') query?: string,
  ) {
    return success(await this.service.findShared(req.user.userSeq, query));
  }

  @Get(':programSeq')
  @ApiOperation({ summary: '접근 가능한 트레이닝 프로그램 단건 조회' })
  async findOne(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return success(await this.service.findOne(programSeq, req.user.userSeq));
  }

  @Post(':programSeq/versions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 프로그램의 새 버전 생성' })
  async createVersion(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Body() request: CreateTrainingProgramVersionRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return success(
      await this.service.createVersion(
        programSeq,
        req.user.userSeq,
        request,
      ),
    );
  }

  @Post(':programSeq/download')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '공개 프로그램을 내 프로그램으로 복사' })
  async download(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return success(await this.service.download(programSeq, req.user.userSeq));
  }

  @Post(':programSeq/start')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 트레이닝 프로그램 시작 또는 재개' })
  async start(
    @Param('programSeq', ParseIntPipe) programSeq: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return success(await this.service.start(programSeq, req.user.userSeq));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 트레이닝 프로그램 등록' })
  async create(
    @Body() request: CreateTrainingProgramRequestDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return success(await this.service.create(req.user.userSeq, request));
  }
}
