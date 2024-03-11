import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService : UsersService){}

    @Get("/:userId")
    async getUsers(@Param("userId") userId : string){
        return this.userService.getUser(userId);
    }

    @Post()
    async createUser(@Body() createUserDto : CreateUserDto){
        console.log(createUserDto)
        return await this.userService.create(createUserDto);
    }
}
