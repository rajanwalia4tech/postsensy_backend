import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SECRET_KEY } from "src/common/constants/app.constants";
import {Request, Response, NextFunction} from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async use(request: Request, res: Response, next: NextFunction) {
    const token = request.headers["authorization"];
    if (!token ) {
      throw new HttpException(
        'Authorization header not present!',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
        const payload = await this.jwtService.verifyAsync( token, {secret: SECRET_KEY});
          if (request.method === 'GET') {
            request.query.userId = payload.userId;
        } else {
            request.body.userId = payload.userId;
        }
    } catch(err){
        throw new HttpException(
            'Token is invalid!',
            HttpStatus.BAD_REQUEST,
        );
    }
    next();
  }
}
