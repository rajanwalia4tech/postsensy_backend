import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LinkedinInfo } from './entities/linkedin.entity';
import { LinkedinInfoRepository } from './repositories/linkedin-info.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { link } from 'joi';

@Injectable()
export class UsersService {
    constructor(
        private readonly userRepository : UserRepository,
        private readonly linkedinInfoRepository : LinkedinInfoRepository,
        @InjectEntityManager() private entityManager: EntityManager,
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

    async verifyLinkedin(userId : number){
        await this.userRepository.update({id: userId},{ isLinkedinConnected:true});
        return true;
    }


    async saveLinkedinInfo(payload : any){
        // TODO : Need to add transaction as this are atomic queries currently.
        const user = await this.userRepository.findOneBy({id : payload.userId});
        const linkedinInfo = await this.linkedinInfoRepository.save({
            accessToken : payload.accessToken,
            name : payload.name,
            email : payload.email,
            isEmailVerified : payload.isEmailVerified,
            expiresIn : payload.expiresIn,
            metaData : payload.metaData,
            userId : payload.userId
        });

        await this.userRepository.update({id: payload.userId },
        {linkedinId :linkedinInfo.id, isLinkedinConnected : true});
    }

    async getLinkedinInfo(userId:number){
        const linkedinInfo = await this.linkedinInfoRepository.findOne({
            where: {
                userId
            },
            select : ['id','userId','name','email','isEmailVerified','createdAt','updatedAt']
        });
        if(!linkedinInfo)
            throw new HttpException("Linkedin is not connected",HttpStatus.BAD_REQUEST);

        return linkedinInfo;
    }
}
