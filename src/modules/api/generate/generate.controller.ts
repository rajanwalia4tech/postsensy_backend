import { Controller, Get, Post } from '@nestjs/common';
import { CreateUsecaseDto } from './dtos/create-usecase.dto';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {

    constructor(
        private generateService : GenerateService
    ){}

    @Get("/usecase")
    getActiveUseCase(){
        return this.generateService.getActiveUsecases();
    }

    @Post("/usecase")
    createUsecase(payload : CreateUsecaseDto){
        
        return "success";
    }

}
