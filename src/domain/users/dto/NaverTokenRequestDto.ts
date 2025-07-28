import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NaverTokenRequestDto {
  @ApiProperty({
    description: '네이버 OAuth 인증 코드',
    example: 'YOUR_NAVER_OAUTH_CODE'
  })
  @IsString()
  code: string;

  @IsString()
  state: string;
} 