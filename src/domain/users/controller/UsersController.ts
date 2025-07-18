import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { OAuthService } from '../service/OAuthService';
import {RsData, success} from "../../../common/rsData/RsData";

@ApiTags('Users')
@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private readonly configService: ConfigService,
        private readonly oauthService: OAuthService,
    ) {}
    @Get('naver/createNaverUser')
    @ApiOperation({ summary: '네이버 OAuth 로그인 콜백' })
    async createNaverUser(@Query('code') code: string, @Query('state') state: string) {
        const naverUser = await this.oauthService.createNaverUser(code, state);
        // TODO: 프론트엔드로 리다이렉트 또는 토큰 반환

        console.log(naverUser);

        return await success(naverUser);
    }
} 