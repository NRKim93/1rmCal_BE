import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NaverTokenRequestDto {
  @ApiProperty({
    description: '네이버 OAuth 인증 코드',
    example: 'YOUR_NAVER_OAUTH_CODE'
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'OAuth 인증 후 리다이렉트될 URI',
    example: 'http://localhost:3000/auth/naver/callback'
  })
  @IsUrl()
  redirect_uri: string;
} 