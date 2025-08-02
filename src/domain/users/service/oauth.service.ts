import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {HttpStatusCode} from "axios";
import {NaverTokenRequestDto} from "../dto/naver-token-request.dto";
import {NaverTokenResponseDto} from "../dto/naver-token-response.dto";
import {OauthRepository} from "../repository/oauth.repository";
import { OauthTokenService } from 'src/common/service/OauthTokenService';
import {UserRepository} from "../repository/user.repository";
import {IdGenerate} from "../../../common/utils/IdGenerate";

@Injectable()
export class OauthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly oauthTokenService : OauthTokenService,
    private readonly oauthRepository : OauthRepository,
    private readonly userRepository : UserRepository,
    private readonly idUtil : IdGenerate,
  ) {}

  //  회원 정보 조회
  async createNaverUser(dto : NaverTokenRequestDto) : Promise<NaverTokenResponseDto> {
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

    if (!nowUser && dto.mode === "signup") {
      const id = await this.idUtil.idGenerate("users");
      const newUser = await this.userRepository.createNewUser(id, naverUser, "NAVER");

      return {email : newUser.email, code : HttpStatusCode.Created};
    } else if(!nowUser && dto.mode ==="login") {
      return {email : naverUser.email, code : HttpStatusCode.Created};
    } else {
      return {email : "", code : HttpStatusCode.Ok};
    }
  }
}
