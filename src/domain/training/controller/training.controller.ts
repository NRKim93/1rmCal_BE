import {Controller, Get, ParseIntPipe, Query} from '@nestjs/common';
import {TrainingService} from "../service/training.service";
import {success} from "../../../common/rsData/RsData";


@Controller('/api/v1/training')
export class TrainingController {
    constructor(
        private readonly trainingService: TrainingService
    ) {
    }

    @Get(`/getLatestHistory`)
    async getLatestHistory(@Query('seq') seq: number) {
        const lastHistory = await this.trainingService.getLatestHistory(seq);

        console.log(lastHistory);

        return await success(lastHistory);
    }
}