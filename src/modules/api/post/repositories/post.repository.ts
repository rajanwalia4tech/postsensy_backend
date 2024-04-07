import { Repository } from "typeorm";
import { Post } from "../entities/post.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostRepository extends Repository<Post>{
    constructor(@InjectRepository(Post) private  postRepository : Repository<Post>){
        super(postRepository.target, postRepository.manager, postRepository.queryRunner);
    }
}