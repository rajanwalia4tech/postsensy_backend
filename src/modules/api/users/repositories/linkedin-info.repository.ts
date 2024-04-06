import { Repository } from "typeorm";
import { LinkedinInfo } from "../entities/linkedin.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LinkedinInfoRepository extends Repository<LinkedinInfo>{
    constructor(
        @InjectRepository(LinkedinInfo) private  linkedinRepository : Repository<LinkedinInfo>
    ){
        super(linkedinRepository.target, linkedinRepository.manager, linkedinRepository.queryRunner);
    }

    
}