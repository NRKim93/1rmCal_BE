import { Injectable } from '@nestjs/common';
import {getLastTrainingHistory} from "../dto/training.dto";
import {TrainingRepository} from "../repository/training.repository";

@Injectable()
export class TrainingService {
    constructor(
        private readonly trainingRepo : TrainingRepository
    ) {
    }

    async getLatestHistory(seq: number) {
        const history = await this.trainingRepo.getLatestTrainingByUser(seq);
        return history;
    }
}
