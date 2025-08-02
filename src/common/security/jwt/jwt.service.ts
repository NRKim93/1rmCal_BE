import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {ErrorCode} from "../../exception/error-code.enum";

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  //  AccessToken 생성
  async generateAccessToken(payload: any): Promise<string> {
    const privateKeyBase64 = this.configService.get<string>('JWT_PRIVATE_KEY');

    if(!privateKeyBase64) {
      throw ErrorCode.JWT_PRIVATE_KEY_FAILED;
    }

    const privateKey = Buffer.from(privateKeyBase64,'base64').toString('utf-8');
    return this.jwtService.signAsync(payload, {
      algorithm: 'RS256',
      privateKey,
      expiresIn: '1h',
    });
  }

  //  AccessToken 인증
  async verifyToken(token: string): Promise<any> {
    const publicKeyBase64 = this.configService.get<string>('JWT_PUBLIC_KEY');

    if(!publicKeyBase64) {
      throw ErrorCode.JWT_PUBLIC_KEY_FAILED;
    }

    const publicKey = Buffer.from(publicKeyBase64, 'base64').toString('utf-8');
    return this.jwtService.verifyAsync(token, {
      algorithms: ['RS256'],
      publicKey,
    });
  }
} 