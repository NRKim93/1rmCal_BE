import {Body, Controller, Get, Post, Query, Res} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {OauthService} from '../service/oauth.service';
import {created, RsData, success} from "../../../common/rsData/RsData";
import {UserService} from "../service/user.service";
import {NaverTokenRequestDto} from "../dto/naver-token-request.dto";
import {UserJoinRequestDto} from "../dto/user-join-request.dto";
import {HttpStatusCode} from "axios";
import {Response} from "express";

@ApiTags('Users')
@Controller('/api/v1/users')
export class UsersController {
    constructor(
        private readonly oauthService: OauthService,
        private readonly userService: UserService,
    ) {}
    @Get('/naver/createNaverUser')
    @ApiOperation({ summary: '네이버 OAuth 로그인 콜백' })
    async createNaverUser(@Query() dto: NaverTokenRequestDto, @Res({passthrough : true}) res: Response) {
        const naverUser = await this.oauthService.createNaverUser(dto,res);
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