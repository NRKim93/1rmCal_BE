import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {HttpStatusCode} from "axios";
import {NaverTokenRequestDto} from "../dto/naver-token-request.dto";
import {NaverTokenResponseDto} from "../dto/naver-token-response.dto";
import {OauthRepository} from "../repository/oauth.repository";
import { OauthTokenService } from 'src/common/service/OauthTokenService';
import {UserRepository} from "../repository/user.repository";
import {IdGenerate} from "../../../common/utils/id.generate";
import {JwtService} from "../../../common/security/jwt/jwt.service";
import {CookieUtil} from "../../../common/utils/cookie.util";
import {Response} from "express";

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly oauthTokenService : OauthTokenService,
    private readonly oauthRepository : OauthRepository,
    private readonly userRepository : UserRepository,
    private readonly idUtil : IdGenerate,
    private readonly jwtService : JwtService,
  ) {}

  //  회원 정보 조회
  async createNaverUser(dto : NaverTokenRequestDto, res:Response) : Promise<NaverTokenResponseDto> {
    const naverClientId = this.configService.get('NAVER_CLIENT_ID');
    const naverClientSecret = this.configService.get('NAVER_CLIENT_SECRET');
    const naverTokenUrl = this.configService.get('NAVER_TOKEN_URI');
    const naverProfileUrl = this.configService.get('NAVER_PROFILE_URI');
    const {code, state} = dto;

    // 1. 코드를 이용해 액세스 토큰 요청
    const tokenResponse = await this.oauthTokenService.getOauthToken({
      oauthTokenUrl:naverTokenUrl,
      oauthClientId:naverClientId,
      oauthClientSecret:naverClientSecret,
      code:code,
      state:state
    });

    const accessToken = tokenResponse.access_token;

    const profileResponse = await  this.oauthTokenService.getUserInfo(naverProfileUrl,accessToken);
    
    const naverUser = profileResponse.data.response;

    // TODO: 사용자 정보를 DB에서 조회하거나 새로 생성하는 로직
    const nowUser =await this.oauthRepository.findNaverUser(naverUser);

    //  회원 가입 통해서 왔으며, 신규 유저인 경우
    if (!nowUser && dto.mode === "signup") {
      const id = await this.idUtil.idGenerate("users");
      const newUser = await this.userRepository.createNewUser(id, naverUser, "NAVER");

      return {email : newUser.email, code : HttpStatusCode.Created};
    } else if(!nowUser && dto.mode ==="login") {
      //  로그인 버튼 통해서 왔지만 회원이 아닌경우
      return {email : naverUser.email, code : HttpStatusCode.Created};
    } else {
      const cookieExpire = this.configService.get('COOKIE_EXPIRE_TIME');
      const domain = this.configService.get('COOKIE_DOMAIN');

      //  이미 회원인 경우엔 토큰 생성
      await this.jwtService.generateAccessToken(res,nowUser.id);
      await this.jwtService.generateRefreshToken(res,nowUser.id);



      return {email : "", code : HttpStatusCode.Ok};
    }
  }
}
