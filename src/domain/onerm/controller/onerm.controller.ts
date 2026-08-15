import { Controller, Post, Body, Query, Req } from '@nestjs/common';
import { OnermService } from '../service/onerm.service';
import { Public } from '../../../common/security/public.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { onermRequestDto, OnermSaveDto } from '../dto/onerm.dto';
import { success } from '../../../common/rsData/RsData';
import { AuthenticatedRequest } from '../../../common/security/authenticated-request';


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

  @Post()
  @ApiOperation({summary: '1rm 기록 저장용 컨트롤러 '})
  async saveOnerm(
    @Body() request: OnermSaveDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const saveResult = this.service.save({
      ...request,
      author: String(req.user.userSeq),
    });
    
    return success(saveResult); 
  }

  
}
