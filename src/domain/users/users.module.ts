import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { OauthService } from './service/oauth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import {UserService} from "./service/user.service";
import {PrismaService} from "../../common/service/PrismaService";
import {OauthRepository} from "./repository/oauth.repository";
import {OauthTokenService} from "../../common/service/OauthTokenService";
import {UserRepository} from "./repository/user.repository";
import {UtilRepository} from "../../common/repository/UtilRepository";
import {IdGenerate} from "../../common/utils/id.generate";
import {CookieUtil} from "../../common/utils/cookie.util";
import {JwtService} from "../../common/security/jwt/jwt.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [HttpModule, ConfigModule, JwtModule.register({})],
    controllers: [UsersController],
    providers: [
        OauthRepository,
        OauthService,
        UserRepository,
        UserService,
        PrismaService,
        OauthTokenService,
        UtilRepository,
        IdGenerate,
        JwtService,
        CookieUtil
    ],
    exports:[
        PrismaService,
        OauthRepository,
        UserRepository,
        UtilRepository,
        IdGenerate,
        JwtService,
        CookieUtil
    ]
})
export class UsersModule {} 