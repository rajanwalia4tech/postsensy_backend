import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenRepository } from './token.repository';
import { Token } from './entities/token.entity';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token) private tokenRepository : TokenRepository<Token>
        ){}

    async saveToken(userId:number, token : string, type: TokenType) : Promise<Token>{
        const newToken = this.tokenRepository.create({
            userId,
            token,
            type
        });
        const savedToken = await this.tokenRepository.save(newToken);
        return savedToken;
    }

    async verifyToken(userId:number, token : string, type: TokenType){
        const verifyToken = await this.tokenRepository.findOneBy({
            userId,
            token,
            type,
            revoked:false
        });
        if(!verifyToken){
            throw new BadRequestException("Invalid Token");
        }
        await this.tokenRepository.update(
            {id : verifyToken.id},
            {revoked:true});
        return true;
    }
}
