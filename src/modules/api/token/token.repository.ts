import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';

export class TokenRepository<Token> extends Repository<Token> {}
