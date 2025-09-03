import {Module} from "@nestjs/common";
import {AuthController} from "./controller/auth.controller.ts/auth.controller";
import {AuthService} from "./service/auth.service";
import {JwtService} from "../../common/security/jwt/jwt.service";
import {CookieUtil} from "../../common/utils/cookie.util";
import {ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";



@Module({
    imports: [
        JwtModule.register({})
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService,CookieUtil,ConfigService],
    exports:[AuthService,ConfigService,JwtService]
})

export class AuthModule {}