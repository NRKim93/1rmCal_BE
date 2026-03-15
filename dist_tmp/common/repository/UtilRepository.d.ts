import { PrismaService } from "../service/PrismaService";
export declare class UtilRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    idGenerate(key: string): Promise<number>;
    setId(key: string): Promise<void>;
}
