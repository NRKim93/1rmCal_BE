import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import {HttpStatusCode} from "axios";
import {ErrorCode} from "../../../common/exception/error-code.enum";

@Injectable()
export class UserService {
    constructor(
       private readonly httpService: HttpService
    ) {}

    //  닉네임 입력
    async createNickname(email:string,nickname: string):Promise<HttpStatusCode> {
        const prisma = new PrismaClient();

        //  입력받은 닉네임이 db에 있는지 체크
        const checkNicnameExists  = await prisma.users.findFirst({
            where: {
                nickname: nickname,
                email: email,
            },
        });


        if (checkNicnameExists) {
            throw ErrorCode.NOW_USING_NICKNAME;
        }

        await prisma.users.update({
            where: {email:email},
            data: {nickname:nickname},
        });

        return HttpStatusCode.Ok;
    }
}