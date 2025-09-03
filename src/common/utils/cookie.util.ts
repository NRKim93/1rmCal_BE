import {Response} from "express";
import {INestApplication} from "@nestjs/common";
import cookieParser from 'cookie-parser'

export class CookieUtil {
    static setCookie(
        res : Response,
        name : string,
        value : string,
        maxAge : number,
        domain? : string
    ) {
        const option : any = {
            httpOnly:true,
            secure:false,
            sameSite:'lax',
            maxAge,
            path:'/',
        };

        //  domain 값이 프로퍼티에 지정 되어 있으면 해당 값 ㄱㄱ
        if(domain) option.domain = domain;

        res.cookie(name,value,option);
    }

    static clearCookie(
        res : Response,
        name : string,
        domain? : string
    ) {
        const option : any = {
            httpOnly : true,
            secure : false,
            sameSite : 'lax',
            maxAge : 0,
            path:'/',
        };

        if (domain) option.domain = domain;

        res.cookie(name,'',option);
    }

    static useCookieParser(app: INestApplication) {
        app.use(cookieParser());
    }
}