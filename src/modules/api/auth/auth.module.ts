import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/common/constants/app.constants';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailHelper } from 'src/helpers/emailHelper';
import { TokenModule } from '../token/token.module';
import { LinkedinApiHelper } from 'src/helpers/linkedApiHelper';
import { AxiosHelper } from 'src/helpers/axiosHelper';
import { TokenValidationMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports : [
    UsersModule,
    TokenModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: SECRET_KEY
        }
      }
    })
  ],
  providers: [AuthService, AxiosHelper, EmailHelper, LinkedinApiHelper],
  controllers: [AuthController]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .forRoutes({ path : "/auth/linkedin/callback", method : RequestMethod.GET});
  }
}
