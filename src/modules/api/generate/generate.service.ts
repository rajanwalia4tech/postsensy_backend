import { Injectable } from '@nestjs/common';
import { UsecaseRepository } from './repositories/usecase.repository';

@Injectable()
export class GenerateService {

    constructor(
        private readonly usecaseRepository : UsecaseRepository
    ){}

    getActiveUsecases(){
        return this.usecaseRepository.find({ where:{isActive : true}});
    }

}   
