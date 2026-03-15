import { ConfigService } from '@nestjs/config';
import { NaverTokenRequestDto } from "../dto/naver-token-request.dto";
import { NaverTokenResponseDto } from "../dto/naver-token-response.dto";
import { OauthRepository } from "../repository/oauth.repository";
import { OauthTokenService } from 'src/common/service/OauthTokenService';
import { UserRepository } from "../repository/user.repository";
import { IdGenerate } from "../../../common/utils/id.generate";
import { JwtService } from "../../../common/security/jwt/jwt.service";
import { Response } from "express";
export declare class OauthService {
    private readonly configService;
    private readonly oauthTokenService;
    private readonly oauthRepository;
    private readonly userRepository;
    private readonly idUtil;
    private readonly jwtService;
    constructor(configService: ConfigService, oauthTokenService: OauthTokenService, oauthRepository: OauthRepository, userRepository: UserRepository, idUtil: IdGenerate, jwtService: JwtService);
    createNaverUser(dto: NaverTokenRequestDto, res: Response): Promise<NaverTokenResponseDto>;
}
