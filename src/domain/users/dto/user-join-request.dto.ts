import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserJoinRequestDto {
    @ApiProperty({
        description: 'client에서 입력한 닉네임 DB 등록 ',
        example: 'TEST_MAN_001'
    })
    @IsString()
    nickName: string;

    @ApiProperty({
        description: '유저의 email 주소'
    })
    @IsString()
    email: string;
}