import {HttpService} from "@nestjs/axios";
import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";

@Injectable()
export class OauthTokenService {
    constructor(
        private readonly httpService: HttpService
    ) {}

    async getOauthToken({
        oauthTokenUrl,
        oauthClientId,
        oauthClientSecret,
        code,
        state,
    } : {
        oauthTokenUrl : string,
        oauthClientId : string,
        oauthClientSecret : string,
        code : string,
        state : string
    }) {
        const response = await firstValueFrom(
            this.httpService.post(oauthTokenUrl,null,{
                params: {
                    grant_type : 'authorization_code',
                    client_id : oauthClientId,
                    client_secret : oauthClientSecret,
                    code,
                    state,
                },
            }),
        );

        return response.data;
    }

    async getUserInfo(userInfoUrl:string,accessToken :string) {
        const userInfo = await firstValueFrom(
            this.httpService.get<any>(userInfoUrl,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }),
        );

        return userInfo;
    }
}