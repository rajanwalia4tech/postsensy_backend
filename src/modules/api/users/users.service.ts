import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        const response = await this.userRepository.save(createUserDto);
        delete response.password;
        return response;
    }

    async getUser(userId:number){
        const user = await this.userRepository.findOneBy({id: userId});
        delete user.password;
        return user;
    }

    async getUserByEmail(email:string){
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new HttpException(
                "Email is invalid",
            HttpStatus.BAD_REQUEST);
        }
        delete user.password;
        return user;
    }

    async updatePassword(userId:number,password:string){
        const hash = await this.encryptPassword(password);
        await this.userRepository.update({
            id : userId
        },{password:hash});
        return true;
    }

    async encryptPassword(password : string) {
        const saltOrRounds = 10;
        const hash :string = await bcrypt.hash(password, saltOrRounds);
        return hash;
    }

    async checkUser(email:string, password:string){ // for login
        const user = await this.userRepository.findOneBy({email});
        if(!user){
            throw new HttpException(
            "Invalid User",
            HttpStatus.BAD_REQUEST);
        }
        if(await this.checkPassword(user.password,password)){
            delete user.password;
            return user;
        }else{
            throw new HttpException(
            "Invalid Password",
            HttpStatus.BAD_REQUEST);
        }
    }

    async checkPassword(hash:string,password:string){
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }

    async verifyEmail(userId:number){
        await this.userRepository.update({id: userId},{isEmailVerified:true});
        return true;
    }
}
