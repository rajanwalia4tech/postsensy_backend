import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usecase } from './entities/usecase.entity';
import { UsecaseRepository } from './repositories/usecase.repository';
import { ChatGptService } from './chatgpt.service';



@Module({
  imports :[
    TypeOrmModule.forFeature([
      Usecase
    ])
  ],
  controllers: [GenerateController],
  providers: [GenerateService,UsecaseRepository,ChatGptService]
})
export class GenerateModule {}
