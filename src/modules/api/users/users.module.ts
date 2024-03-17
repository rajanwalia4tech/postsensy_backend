import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { TokenValidationMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailHelper } from 'src/helpers/emailHelper';

@Module({
  imports : [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersService, UserRepository, JwtService,EmailHelper],
  controllers: [UsersController],
  exports : [UsersService]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .forRoutes(UsersController);
  }
}
