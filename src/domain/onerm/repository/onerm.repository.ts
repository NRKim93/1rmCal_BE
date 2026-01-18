import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/service/PrismaService";
import { OnermSaveDto } from "../dto/onerm.dto";

@Injectable()
export class OnermRepository {
    //
    constructor(
        private readonly prisma : PrismaService
    ){}

    async save(request: OnermSaveDto) {
        return this.prisma.onerm.create({
            data: {
                author: request.author,
                training_name: request.trainingName,
                weight: request.weight,
                unit: request.unit
            }
        });
    }
}