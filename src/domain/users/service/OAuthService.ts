import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import { PrismaClient } from '@prisma/client';
import {idGenerate} from "../../utils/IdGenerate";
import {HttpStatusCode} from "axios";
import {NaverTokenRequestDto} from "../dto/NaverTokenRequestDto";
import {NaverTokenResponseDto} from "../dto/NaverTokenResponseDto";

@Injectable()
export class OAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  //  회원 정보 조회
  async createNaverUser(dto : NaverTokenRequestDto) : Promise<NaverTokenResponseDto> {
    const naverClientId = this.configService.get('NAVER_CLIENT_ID');
    const naverClientSecret = this.configService.get('NAVER_CLIENT_SECRET');
    const naverTokenUrl = this.configService.get('NAVER_TOKEN_URI');
    const naverProfileUrl = this.configService.get('NAVER_PROFILE_URI');
    const prisma = new PrismaClient();
    const {code, state} = dto;

    // 1. 코드를 이용해 액세스 토큰 요청
    const tokenResponse = await firstValueFrom(
      this.httpService.post<any>(naverTokenUrl, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: naverClientId,
          client_secret: naverClientSecret,
          code,
          state,
        },
      }),
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 액세스 토큰을 이용해 사용자 프로필 정보 요청
    const profileResponse = await firstValueFrom(
      this.httpService.get<any>(naverProfileUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    
    const naverUser = profileResponse.data.response;

    // TODO: 사용자 정보를 DB에서 조회하거나 새로 생성하는 로직
    const nowUser = await prisma.oauths.findFirst({
      where: {
        identify : naverUser.id
      }
    });

    if (!nowUser) {
      const id = await idGenerate("users");
      const newUser = await prisma.users.create({
        data : {
          id : id,
          nickname :"",
          email : naverUser.email
        }
      });

      await prisma.oauths.create({
        data : {
          platform : "NAVER",
          identify : String(naverUser.id),
          users: {
            connect : {seq : newUser.seq}
          }
        }
      });

      return {email : newUser.email, code : HttpStatusCode.Created};
    } else {
      return {email : "", code : HttpStatusCode.Ok};
    }
  }
}
