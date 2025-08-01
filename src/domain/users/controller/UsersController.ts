import {Body, Controller, Get, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OAuthService} from '../service/OAuthService';
import {created, RsData, success} from "../../../common/rsData/RsData";
import {UserService} from "../service/UserService";
import {NaverTokenRequestDto} from "../dto/NaverTokenRequestDto";
import {UserJoinRequestDto} from "../dto/UserJoinRequestDto";
import {HttpStatusCode} from "axios";

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

        if(naverUser.code == HttpStatusCode.Created) return await created(naverUser);

        return await success(naverUser.code);
    }

    @Post('/setNickname')
    @ApiOperation({summary:'닉네임 입력'})
    async createNickname(@Body() dto:UserJoinRequestDto) : Promise<RsData> {
        const newNickName = await this.userService.createNickname(dto);

        return  await success(newNickName);
    }

} 