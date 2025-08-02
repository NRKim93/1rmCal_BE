import {Injectable} from "@nestjs/common";
import {UtilRepository} from "../repository/UtilRepository";

@Injectable()
export class IdGenerate {
    constructor(private readonly repository : UtilRepository) {}

    async idGenerate(key: string): Promise<string>{
        const  idValue = await this.repository.idGenerate(key);

        const newId = String(idValue).padStart(4, '0');
        const id = `THE_GYM_${newId}`;

        await this.repository.setId(key);

        return id;
    }

}
