import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RedisService } from '../../service/redis/redis.service';
import { JwtService } from './jwt.service';

describe('JwtService cookie configuration', () => {
  const values: Record<string, string> = {
    JWT_PRIVATE_KEY: Buffer.from('private-key').toString('base64'),
    JWT_EXPIRE_TIME: '3600',
    REFRESH_EXPIRE_TIME: '604800',
    COOKIE_EXPIRE_TIME: '604800000',
    COOKIE_DOMAIN: 'dgym.shop',
    COOKIE_SECURE: 'true',
    REFRESH_TOKEN: 'refreshToken',
  };

  const configService = {
    get: jest.fn((key: string) => values[key]),
  } as unknown as ConfigService;
  const nestJwtService = {
    sign: jest.fn().mockReturnValue('signed-token'),
  } as unknown as NestJwtService;
  const redisService = {
    hset: jest.fn().mockResolvedValue(undefined),
  } as unknown as RedisService;
  const response = {
    cookie: jest.fn(),
  } as unknown as Response;

  let service: JwtService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new JwtService(configService, nestJwtService, redisService);
  });

  it('applies the shared production cookie options to the access token', async () => {
    await service.generateAccessToken(response, 'naver-user');

    expect(response.cookie).toHaveBeenCalledWith(
      'accessToken',
      'signed-token',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 604800000,
        path: '/',
        domain: 'dgym.shop',
      },
    );
  });

  it('applies the shared production cookie options to the refresh token', async () => {
    await service.generateRefreshToken(response, 'naver-user');

    expect(redisService.hset).toHaveBeenCalledWith(
      'refreshToken',
      'naver-user',
      'signed-token',
    );
    expect(response.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'signed-token',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 604800000,
        path: '/',
        domain: 'dgym.shop',
      },
    );
  });

  it('rejects an invalid cookie lifetime', async () => {
    values.COOKIE_EXPIRE_TIME = '';

    await expect(
      service.generateAccessToken(response, 'naver-user'),
    ).rejects.toThrow('COOKIE_EXPIRE_TIME must be a positive number');

    values.COOKIE_EXPIRE_TIME = '604800000';
  });
});
