import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../common/service/PrismaService";

@Injectable()
export class OauthRepository {
    constructor(
        private readonly prisma : PrismaService
    ) {}

    async findNaverUser(naverUser : {id:string}) : Promise<any> {
        return this.prisma.oauths.findFirst({
            include: {
                users : true
            },
            where : {
                identify : naverUser.id
            }
        });
    }
}