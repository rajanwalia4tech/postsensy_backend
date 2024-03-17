import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenRepository } from './token.repository';

@Module({
  imports :[
    TypeOrmModule.forFeature([Token])
  ],
  providers: [TokenService, TokenRepository],
  exports : [TokenService]
})
export class TokenModule {}
