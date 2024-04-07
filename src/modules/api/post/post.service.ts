import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from './repositories/post.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreatePostContextDto, CreatePostTitleDto, PublishPostDto, SchedulePostDto } from './dtos/post.dto';
import { LinkedinApiHelper } from 'src/helpers/linkedApiHelper';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostService {

    constructor(
        private readonly postRepository : PostRepository,
        @InjectEntityManager() private entityManager: EntityManager,
        private linkedinApiHelper : LinkedinApiHelper,
        private userService : UsersService
    ){}
    
    async saveContext(payload : CreatePostContextDto){
        const post = await this.postRepository.save({
            userId : payload.userId,
            context : payload.context
        });
        return {postId : post.postId, context : post.context};
    }

    async getPostByUserId(userId : number, postId : string){
        const post = await this.postRepository.findOne({where : {
            postId : postId,
            userId : userId
        }})

        if(!post){
            throw new HttpException("Invalid postId", HttpStatus.BAD_REQUEST);
        }
        return post;
    }

    async saveTitle(payload : CreatePostTitleDto){
        const existingPost = await this.getPostByUserId(payload.userId,payload.postId);
        await this.postRepository.update(
            {id : existingPost.id},
            {title : payload.title}
        );
        return {postId : payload.postId, title : payload.title};
    }

    async saveContent(payload : PublishPostDto){
        const existingPost = await this.getPostByUserId(payload.userId,payload.postId);
        await this.postRepository.update(
            {id : existingPost.id},
            {content : payload.content}
        );
        return {postId : payload.postId, content : payload.content};
    }

    async publishPost(payload : PublishPostDto){
        try{
            const linkedinInfo = await this.userService.getFullLinkedinInfo(payload.userId);
            const post = await this.saveContent(payload);
            await this.linkedinApiHelper.publishPost({
                accessToken : linkedinInfo.accessToken,
                personId : linkedinInfo.personId,
                text : payload.content
            });
            await this.postRepository.update({postId : payload.postId},{publishedAt : new Date()})
            return {postId : payload.postId, content : payload.content}
        }catch(err){
            console.log(err.message);
            this.postRepository.update({postId : payload.postId},{error : err.message});
            throw new HttpException("Error Occurred while publishing post", HttpStatus.UNPROCESSABLE_ENTITY)
        }

    }

    async schedulePost(payload : SchedulePostDto){
        return await this.saveContent(payload);
    }
}
