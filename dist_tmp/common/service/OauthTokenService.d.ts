import { HttpService } from "@nestjs/axios";
export declare class OauthTokenService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getOauthToken({ oauthTokenUrl, oauthClientId, oauthClientSecret, code, state, }: {
        oauthTokenUrl: string;
        oauthClientId: string;
        oauthClientSecret: string;
        code: string;
        state: string;
    }): Promise<any>;
    getUserInfo(userInfoUrl: string, accessToken: string): Promise<import("axios").AxiosResponse<any, any>>;
}
