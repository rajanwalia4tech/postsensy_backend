import { Repository } from "typeorm";
import { Usecase } from "../entities/usecase.entity";
import { InjectRepository } from "@nestjs/typeorm";


export class UsecaseRepository extends Repository<Usecase>{
    constructor(
        @InjectRepository(Usecase) private  usecaseRepository : Repository<Usecase>
    ){
        super(usecaseRepository.target, usecaseRepository.manager, usecaseRepository.queryRunner);
    }
}