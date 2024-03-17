import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'mysql',
            host: configService.get("MYSQL_DB_HOST"),
            port: configService.get("MYSQL_DB_PORT"),
            username: configService.get("MYSQL_DB_USERNAME"),
            password: configService.get("MYSQL_DB_PASSWORD"),
            database: configService.get("MYSQL_DB_NAME"),
            entities: ['dist/**/*.entity.js'],
            synchronize: true,
            retryAttempts:10,
            autoLoadEntities: true,
            logging: false,
            namingStrategy : new SnakeNamingStrategy()
          }),
        }),
    ],
})
export class MysqlConfigModule {}
