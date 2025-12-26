import { Controller, Post, Body, BadRequestException, Query } from '@nestjs/common';
import { OnermService } from '../service/onerm.service';
import { Public } from 'src/common/security/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { onermRequestDto } from '../dto/onerm-calculating.dto';
import { success } from 'src/common/rsData/RsData';


@Controller('/api/v1/onerm')
export class OnermController {
  constructor(private readonly service: OnermService) {}

  @Public()
  @Post('/cal')
  @ApiOperation({ summary: '1rm 측정용 컨트롤러' })
  async calculate(@Query() request: onermRequestDto) {
    const calResult = this.service.calculating(request); 

    return success(calResult);
  }
}
