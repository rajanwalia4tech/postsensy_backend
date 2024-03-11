import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository : UserRepository
    ){}
    
    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepository.findOne({ where :{email : createUserDto.email}});
        if(user){
            throw new BadRequestException("Email you are using is already exists");
        }
        return await this.userRepository.save(createUserDto);
    }

    async getUser(userId){
        return await this.userRepository.findOneBy({id: userId});
    }
}
