import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import { PrismaClient } from "@prisma/client";
import {HttpStatusCode} from "axios";
import {ErrorCode} from "../../../common/exception/error-code.enum";
import {UserJoinRequestDto} from "../dto/UserJoinRequestDto";

@Injectable()
export class UserService {
    constructor(
       private readonly httpService: HttpService
    ) {}

    //  닉네임 입력
    async createNickname(dto:UserJoinRequestDto):Promise<HttpStatusCode> {
        const prisma = new PrismaClient();

        //  입력받은 닉네임이 db에 있는지 체크
        const checkNicnameExists  = await prisma.users.findUnique({
            where: {
                nickname: dto.nickName,
                email: dto.email,
            },
        });




        if (checkNicnameExists) {
            throw ErrorCode.NOW_USING_NICKNAME;
        }

        await prisma.users.update({
            where: {email:dto.email},
            data: {nickname:dto.nickName},
        });

        return HttpStatusCode.Ok;
    }
}