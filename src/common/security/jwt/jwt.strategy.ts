import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {ErrorCode} from "../../exception/error-code.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        const publicKeyBase64 = this.configService.get<string>('JWT_PUBLIC_KEY');

        if (!publicKeyBase64) {
          throw ErrorCode.JWT_PUBLIC_KEY_FAILED;
        }

        const publicKey = Buffer.from(publicKeyBase64, 'base64').toString('utf-8');
        done(null, publicKey);
      },
    });
  }

  async validate(payload: any) {
    // payload: JWT에 담긴 사용자 정보
    return payload;
  }
} 