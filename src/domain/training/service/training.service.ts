import { Injectable } from '@nestjs/common';
import {TrainingRepository} from "../repository/training.repository";
import { TrainingCategories } from '../dto/trainingCategories.dto';
import { CreateTrainingRequestDto } from '../dto/training.dto';

@Injectable()
export class TrainingService {
    constructor(
        private readonly trainingRepo : TrainingRepository
    ) {}

    async getLatestHistory(seq: number) {
        const history = await this.trainingRepo.getLatestTrainingByUser(seq);
        return history;
    }

    async getAllTrainingCategories(): Promise<TrainingCategories[]> {
        return await this.trainingRepo.getAllTrainingCategories(); 
    }

    async getAutoComplete(): Promise<TrainingCategories[]> {
        return await this.trainingRepo.getAutoComplete(); 
    }

    async createTraining(param: CreateTrainingRequestDto) {
        return await this.trainingRepo.createTraining(param); 
    }
}
