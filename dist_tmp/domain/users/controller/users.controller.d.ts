import { OauthService } from '../service/oauth.service';
import { RsData } from "../../../common/rsData/RsData";
import { UserService } from "../service/user.service";
import { NaverTokenRequestDto } from "../dto/naver-token-request.dto";
import { UserJoinRequestDto } from "../dto/user-join-request.dto";
import { Response } from "express";
export declare class UsersController {
    private readonly oauthService;
    private readonly userService;
    constructor(oauthService: OauthService, userService: UserService);
    createNaverUser(dto: NaverTokenRequestDto, res: Response): Promise<RsData>;
    createNickname(dto: UserJoinRequestDto): Promise<RsData>;
}
