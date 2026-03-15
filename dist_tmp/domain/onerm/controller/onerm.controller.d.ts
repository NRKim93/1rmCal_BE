import { OnermService } from '../service/onerm.service';
import { onermRequestDto, OnermSaveDto } from '../dto/onerm.dto';
export declare class OnermController {
    private readonly service;
    constructor(service: OnermService);
    calculate(request: onermRequestDto): Promise<import("src/common/rsData/RsData").RsData>;
    saveOnerm(request: OnermSaveDto): Promise<import("src/common/rsData/RsData").RsData>;
}
