import {Injectable} from "@nestjs/common";
import {HttpStatusCode} from "axios";
import {ErrorCode} from "../../../common/exception/error-code.enum";
import {UserJoinRequestDto} from "../dto/user-join-request.dto";
import {PrismaService} from "../../../common/service/PrismaService";
import {UserRepository} from "../repository/user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository : UserRepository
    ) {}

    //  닉네임 입력
    async createNickname(dto:UserJoinRequestDto):Promise<HttpStatusCode> {
        //  입력받은 닉네임이 db에 있는지 체크
        const  checkNicnameExists = await this.userRepository.checkNickname(dto.nickName,dto.email);


        if (checkNicnameExists) {
            throw ErrorCode.NOW_USING_NICKNAME;
        }

        await this.userRepository.setNickName(dto.nickName,dto.email);

        return HttpStatusCode.Ok;
    }
}