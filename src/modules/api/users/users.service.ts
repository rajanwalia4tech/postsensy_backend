import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

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
        createUserDto.password = await this.encryptPassword(createUserDto.password);
        // TODO : Need to remove the password from the return response.
        return await this.userRepository.save(createUserDto);
    }

    async getUser(userId){
        return await this.userRepository.findOneBy({id: userId});
    }

    async encryptPassword(password : string) {
        const saltOrRounds = 10;
        const hash :string = await bcrypt.hash(password, saltOrRounds);
        console.log(hash)
        return hash;
    }

    async checkPassword(hash,password){
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
}
