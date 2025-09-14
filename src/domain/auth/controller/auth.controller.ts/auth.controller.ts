import {Controller, Get, Query, Req, Res} from '@nestjs/common';
import {checked, RsData, success} from "../../../../common/rsData/RsData";
import {Response,Request} from "express";
import {HttpStatusCode} from "axios";
import {AuthService} from "../../service/auth.service";

@Controller('/api/v1/auth')
export class AuthController {
    constructor(
        private readonly auth: AuthService
        ) {
    }

    @Get('/status')
    async statusCheck(
        @Req() req : Request,
        @Res({ passthrough: true }) res: Response
    ):Promise<RsData> {

        //  accessToken 취득
        const access = req.cookies?.accessToken as string

        //  refreshToken 취득
        const refresh = req.cookies?.refreshToken as string;

        const state = await this.auth.verifyAccess(res,access,refresh);

        console.log(state);

        //  accessToken이 유효하지 않은 경우
        if(!state) {
            return checked(HttpStatusCode.Unauthorized, false);
        };

        return checked(HttpStatusCode.Ok,true);
    }
}
