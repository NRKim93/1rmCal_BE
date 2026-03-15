import { RsData } from "../../../../common/rsData/RsData";
import { Response, Request } from "express";
import { AuthService } from "../../service/auth.service";
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    statusCheck(req: Request, res: Response): Promise<RsData>;
}
