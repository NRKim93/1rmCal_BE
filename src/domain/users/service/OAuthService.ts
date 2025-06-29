import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async naverLogin(code: string, state: string) {
    const clientId = this.configService.get('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get('NAVER_CLIENT_SECRET');
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const profileUrl = 'https://openapi.naver.com/v1/nid/me';

    // 1. 코드를 이용해 액세스 토큰 요청
    const tokenResponse = await firstValueFrom(
      this.httpService.post<any>(tokenUrl, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code,
          state,
        },
      }),
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 액세스 토큰을 이용해 사용자 프로필 정보 요청
    const profileResponse = await firstValueFrom(
      this.httpService.get<any>(profileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    
    const naverUser = profileResponse.data.response;

    // TODO: 사용자 정보를 DB에서 조회하거나 새로 생성하는 로직
    // TODO: JWT 토큰 생성 및 반환 로직

    return {
        message: '로그인 성공',
        naverUser,
    };
  }
}
