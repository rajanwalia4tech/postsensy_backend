import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { SECRET_KEY } from 'src/common/constants/app.constants';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { TokenType } from '../token/enums/token-type.enum';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService : JwtService,
        private readonly tokenService : TokenService
    ){}

    async generateToken(user : {id : number, email:string}, tokenType: TokenType){
        const payload = {userId : user.id, email : user.email, type: tokenType};
        const token =  await this.jwtService.sign(payload,{
            secret : SECRET_KEY
        });
        await this.tokenService.saveToken(user.id,token,tokenType);
        return token;
    }

    async verifyToken(token : string, tokenType: TokenType){
        const user = await this.jwtService.verify(token,{
            secret:SECRET_KEY
        });
        await this.tokenService.verifyToken(user.userId, token,tokenType);
        return user;
    }
}
