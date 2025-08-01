import {PrismaService} from "../../../common/service/PrismaService";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma : PrismaService ) {}

    async createNewUser(id : string, naverUser,platform : string) : Promise<any> {
        const newUser = await this.prisma.users.create({
            data : {
                id : id,
                nickname : "",
                email : naverUser.email
            }
        });

        await this.prisma.oauths.create({
            data : {
                platform : platform,
                identify : String(naverUser.id),
                users : {
                    connect : {seq : newUser.seq}
                }
            }
        })

        return newUser;
    }

    async checkNickname(nickName : string, email:string) : Promise<boolean> {
        const exists = await this.prisma.users.findUnique({
            where:{
                nickname : nickName,
                email : email,
            },
        });

        if(exists) return true

        return false
    }

    async setNickName(nickName : string, email : string): Promise<void> {
        await this.prisma.users.update({
            data:{
                nickname:nickName,
            },

            where : {
                email:email
            }
        })
    }
}