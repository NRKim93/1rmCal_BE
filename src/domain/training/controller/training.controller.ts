import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {TrainingService} from "../service/training.service";
import {success} from "../../../common/rsData/RsData";
import {CreateTrainingRequestDto} from "../dto/training.dto";
import { AuthenticatedRequest } from '../../../common/security/authenticated-request';
import { Public } from '../../../common/security/public.decorator';


@Controller('/api/v1/training')
export class TrainingController {
    constructor(
        private readonly trainingService: TrainingService
    ) {
    }

    @Get('/getLatestHistory')
    async getLatestHistory(@Req() req: AuthenticatedRequest) {
        const lastHistory = await this.trainingService.getLatestHistory(req.user.userSeq);

        return await success(lastHistory);
    }

    @Get('/getAllTrainingCategories')
    @Public()
    async getAllTrainingCategories() {
        const trainingCategories = await this.trainingService.getAllTrainingCategories(); 

        return await success(trainingCategories);

    }

    @Get('/getAutoComplete')
    async getAutoComplete() {
        const result = await this.trainingService.getAutoComplete();

        return await success(result);
    }

    @Post('/create')
    async createTraining(
        @Body() param: CreateTrainingRequestDto,
        @Req() req: AuthenticatedRequest,
    ) {
        const authenticatedParam = {
            ...param,
            param: param.param.map((item) => ({
                ...item,
                userSeq: req.user.userSeq,
            })),
        };
        const result = await this.trainingService.createTraining(authenticatedParam);

        return await success(result);
    }
}
