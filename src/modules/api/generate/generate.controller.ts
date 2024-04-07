import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUsecaseDto } from './dtos/create-usecase.dto';
import { GenerateService } from './generate.service';
import { RESPONSE } from 'src/common/constants/response-messages';
import {Response} from 'express';

@Controller('generate')
export class GenerateController {

    constructor(
        private generateService : GenerateService
    ){}


    @Post("")
    async generate(@Body() payload : any, @Res() res : Response){
        if(!payload.usecaseId){
            throw new HttpException("usecaseId is required!", HttpStatus.BAD_REQUEST);
        }
        const response = await this.generateService.generate(payload);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.SUCCESS,
            data : response
        });
    }

    @Get("/usecase")
    async getActiveUseCase(@Res() res : Response){
        const response = await this.generateService.getActiveUsecases();
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.SUCCESS,
            data : response
        });
    }

    @Post("/usecase")
    createUsecase(payload : CreateUsecaseDto){
        
        return "success";
    }




}
