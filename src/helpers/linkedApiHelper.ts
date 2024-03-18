import { Injectable } from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import { AxiosHelper } from './axiosHelper';

@Injectable()
export class LinkedinApiHelper{

    private scope : Array<String> = ['w_member_social', 'openid', 'profile', 'email'];
    private clientId : string;
    private clientSecret : string;
    private redirectUrl : string;

    constructor(
        private readonly configService : ConfigService,
        private readonly axiosHelper : AxiosHelper
    ){
        this.clientId = this.configService.get("LINKEDIN_CLIENT_ID");
        this.clientSecret = this.configService.get("LINKEDIN_CLIENT_SECRET");
        this.redirectUrl = this.configService.get("LINKEDIN_REDIRECT_URL") + "/auth/linkedin/callback";
    }

    getConnectUrl(){
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&scope=${this.scope.join(' ')}&state=123456789&nonce=987654321`;
        return authUrl;
    }

    async getAccessToken(code:string) : Promise<string>{
        const response = await this.axiosHelper.post('https://www.linkedin.com/oauth/v2/accessToken', null,{
            params:{
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.redirectUrl,
                client_id: this.clientId,
                client_secret: this.clientSecret
            }
        });
        return response; // { access_token, expires_in, scope, token_type, id_token }
    }

    async getUserInfoByAccessToken(payload : any){
        const response = await this.axiosHelper.get('https://api.linkedin.com/v2/userinfo',{
            headers : {
              Authorization: `${payload.token_type} ${payload.access_token}`
            }
        });
        return response; // {sub, email_verified, given_name, family_name, email, { locale : { country, language }} }
    }

}