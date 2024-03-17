import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules/api/api.module';
import { MysqlConfigModule } from './config/mysql-config.module';
import {ConfigModule} from '@nestjs/config';
import { envVariablesSchema } from './config/config.validation';
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganModule, MorganInterceptor } from "nest-morgan";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${process.env.NODE_ENV || 'dev'}`,
      validationSchema: envVariablesSchema,
      isGlobal: true,
    }),
    ApiModule,
    MysqlConfigModule,
    MorganModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("tiny"),
    }
  ],
})
export class AppModule {}
