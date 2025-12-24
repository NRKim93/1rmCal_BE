import { ErrorCode } from "../exception/error-code.enum";
import {PrismaService} from "../service/PrismaService";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UtilRepository {
    constructor( private readonly prisma :PrismaService) {}

    async idGenerate(key: string): Promise<number> {
        const idValue = await this.prisma.idtables.findFirst({
            select:{
                id_val:true
            },
            where: {
                id_key: key
            }
        });

        if (!idValue) {
            throw ErrorCode.DATABASE_ERROR;
        }

        return idValue.id_val;
    }

    async setId(key: string) {
        await this.prisma.idtables.update({
            where:{
                id_key: key
            },
            data : {
                id_val: { increment:1}
            }
        })
    }
}