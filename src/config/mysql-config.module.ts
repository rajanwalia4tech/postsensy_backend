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
            host: 'bulk-indexer-rds.c9a40w4y2zjn.us-east-1.rds.amazonaws.com',
            port: 3306,
            username: 'admin',
            password: 'anshaj123',
            database: 'linkedin',
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
