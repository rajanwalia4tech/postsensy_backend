import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules/api/api.module';
import { MysqlConfigModule } from './config/mysql-config.module';

@Module({
  imports: [
    ApiModule,
    MysqlConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
