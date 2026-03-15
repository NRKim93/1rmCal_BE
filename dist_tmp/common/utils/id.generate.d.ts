import { UtilRepository } from "../repository/UtilRepository";
export declare class IdGenerate {
    private readonly repository;
    constructor(repository: UtilRepository);
    idGenerate(key: string): Promise<string>;
}
