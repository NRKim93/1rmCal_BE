import { onermRequestDto, onermResponseDto, OnermSaveDto } from '../dto/onerm.dto';
import { OnermRepository } from '../repository/onerm.repository';
export declare class OnermService {
    private readonly onermRepository;
    constructor(onermRepository: OnermRepository);
    calculating(request: onermRequestDto): onermResponseDto;
    save(request: OnermSaveDto): Promise<{
        weight: import("@prisma/client/runtime/library").Decimal;
        author: string;
        unit: string;
        seq: number;
        training_name: string;
        createdAt: Date;
    }>;
}
