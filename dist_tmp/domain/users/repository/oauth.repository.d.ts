import { PrismaService } from "../../../common/service/PrismaService";
export declare class OauthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findNaverUser(naverUser: {
        id: string;
    }): Promise<any>;
}
