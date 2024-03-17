import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/common/constants/app.constants';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EmailHelper } from 'src/helpers/emailHelper';
import { TokenModule } from '../token/token.module';

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
  providers: [AuthService, EmailHelper],
  controllers: [AuthController]
})
export class AuthModule {}
