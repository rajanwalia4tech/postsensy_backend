import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreatePostContextDto, CreatePostTitleDto } from './dtos/post.dto';

@Injectable()
export class PostService {

    constructor(
        private readonly postRepository : PostRepository,
        @InjectEntityManager() private entityManager: EntityManager,
    ){}
    
    async saveContext(payload : CreatePostContextDto){
        const post = await this.postRepository.save({
            userId : payload.userId,
            context : payload.context
        });
        return {postId : post.postId, context : post.context};
    }

    async saveTitle(payload : CreatePostTitleDto){
        const existingPost = await this.postRepository.findOne({where : {
            postId : payload.postId,
            userId : payload.userId
        }})

        if(!existingPost){
            throw new HttpException("Invalid postId", HttpStatus.BAD_REQUEST);
        }

        await this.postRepository.update(
            {id : existingPost.id},
            {title : payload.title}
        );
        return {postId : payload.postId, title : payload.title};
    }
}
