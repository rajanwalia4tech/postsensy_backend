import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/users.repository';
import { TokenValidationMiddleware } from 'src/middlewares/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EmailHelper } from 'src/helpers/emailHelper';
import { LinkedinInfo } from './entities/linkedin.entity';
import { LinkedinInfoRepository } from './repositories/linkedin-info.repository';

@Module({
  imports : [
    TypeOrmModule.forFeature([User, LinkedinInfo])
  ],
  providers: [UsersService, UserRepository, LinkedinInfoRepository, JwtService,EmailHelper],
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
