import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OAuthService} from '../service/OAuthService';
import {RsData, success} from "../../../common/rsData/RsData";
import {HttpStatusCode} from "axios";
import {UserService} from "../service/UserService";
import {NaverTokenRequestDto} from "../dto/NaverTokenRequestDto";

@ApiTags('Users')
@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private readonly oauthService: OAuthService,
        private readonly userService: UserService,
    ) {}
    @Get('/naver/createNaverUser')
    @ApiOperation({ summary: '네이버 OAuth 로그인 콜백' })
    async createNaverUser(@Query() dto: NaverTokenRequestDto) {
        const naverUser = await this.oauthService.createNaverUser(dto);
        // TODO: 프론트엔드로 리다이렉트 또는 토큰 반환

        console.log(naverUser);

        return await success(naverUser);
    }

    @Post('/create')
    @ApiOperation({summary:'닉네임 입력'})
    async createNickname(@Query('nickName') nickName: string, @Query('email') email: string) : Promise<RsData> {
        const newNickName = await this.userService.createNickname(email,nickName);

        return  await success(HttpStatusCode.Ok);
    }

} 