import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {ErrorCode} from "../../exception/error-code.enum";

//  cookie에서 accessToken 취득
function accessCookieExtractor(req:any) : string | null {
    if(req && req.cookies) {
        return req.cookies['accessToken'] || null;
    }

    return  null;
}

//  cookie에서 refreshToken 취득
function refreshCookieExtractor(req:any) : string | null {
    if(req && req.cookies) {
        return req.cookies['refreshToken'] || null;
    }

    return  null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private readonly configService: ConfigService) {
      const pub = configService.get<string>('JWT_PUBLIC_KEY');
      if (!pub) throw new Error('JWT_PUBLIC_KEY_FAILED');
      const publicKey = Buffer.from(pub, 'base64').toString('utf-8');

      super({
          jwtFromRequest: accessCookieExtractor,
          ignoreExpiration: false,
          algorithms: ['RS256'],
          secretOrKey: publicKey,
    });
  }

  async validate(payload: any) {
    // payload: JWT에 담긴 사용자 정보
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy,'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        const pub = configService.get<string>('JWT_PUBLIC_KEY');
        if (!pub) throw new Error('JWT_PUBLIC_KEY_FAILED');
        const publicKey = Buffer.from(pub, 'base64').toString('utf-8');

        super({
            jwtFromRequest: refreshCookieExtractor,
            ignoreExpiration: false,
            algorithms:['RS256'],
            secretOrKey:publicKey,
        });
    }

    async validate(payload: any) {
        // payload: JWT에 담긴 사용자 정보
        return payload;
    }
}