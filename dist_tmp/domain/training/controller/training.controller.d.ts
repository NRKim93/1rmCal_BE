import { TrainingService } from "../service/training.service";
import { CreateTrainingRequestDto } from "../dto/training.dto";
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
    getLatestHistory(seq: number): Promise<import("../../../common/rsData/RsData").RsData>;
    getAllTrainingCategories(): Promise<import("../../../common/rsData/RsData").RsData>;
    getAutoComplete(): Promise<import("../../../common/rsData/RsData").RsData>;
    createTraining(body: CreateTrainingRequestDto): Promise<number>;
}
