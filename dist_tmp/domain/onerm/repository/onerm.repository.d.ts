import { PrismaService } from "src/common/service/PrismaService";
import { OnermSaveDto } from "../dto/onerm.dto";
export declare class OnermRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(request: OnermSaveDto): Promise<{
        weight: import("@prisma/client/runtime/library").Decimal;
        author: string;
        unit: string;
        seq: number;
        training_name: string;
        createdAt: Date;
    }>;
}
