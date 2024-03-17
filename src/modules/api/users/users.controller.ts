import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { EmailHelper } from 'src/helpers/emailHelper';
import {Response} from 'express';
import { RESPONSE } from 'src/common/constants/response-messages';

@Controller('users')
export class UsersController {
    constructor(
        private userService : UsersService,
        private emailHelper : EmailHelper
    ){}

    @Get("/")
    async getUsers(@Query("userId") userId : number, @Res() res : Response){
        const response = await this.userService.getUser(userId);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.SUCCESS,
            data : response
        });
    }

    @Get("/test")
    async getTest(@Req() req : Request, @Query() query : any){
        return {
            data : {},
            statusCode : HttpStatus.OK
        }
    }
}
