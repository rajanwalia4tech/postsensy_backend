import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { User } from "./entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class UserRepository extends Repository<User>{
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    async createUser(user : any) : Promise<User[]>{
        let newUser = await this.create(user);
        return this.save(newUser);
    }

    async getAll(){

    }
}