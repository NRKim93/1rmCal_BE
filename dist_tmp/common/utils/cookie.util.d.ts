import { Response } from "express";
import { INestApplication } from "@nestjs/common";
export declare class CookieUtil {
    static setCookie(res: Response, name: string, value: string, maxAge: number, domain?: string): void;
    static clearCookie(res: Response, name: string, domain?: string): void;
    static useCookieParser(app: INestApplication): void;
}
