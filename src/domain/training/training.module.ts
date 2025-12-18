import { Module } from '@nestjs/common';
import {TrainingController} from "./controller/training.controller";
import {TrainingService} from "./service/training.service";
import {TrainingRepository} from "./repository/training.repository";
import {PrismaService} from "../../common/service/PrismaService";

@Module({
    imports: [],
    controllers: [TrainingController],
    providers: [TrainingService, TrainingRepository, PrismaService],
    exports: [TrainingService, TrainingRepository]
})
export class TrainingModule {}
