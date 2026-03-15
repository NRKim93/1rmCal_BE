import { PrismaService } from "../../../common/service/PrismaService";
export declare class UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createNewUser(id: string, naverUser: any, platform: string): Promise<any>;
    checkNickname(nickName: string, email: string): Promise<boolean>;
    setNickName(nickName: string, email: string): Promise<void>;
}
