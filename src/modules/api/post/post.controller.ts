import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostContextDto, CreatePostTitleDto } from './dtos/post.dto';
import { Response } from 'express';
import { RESPONSE } from 'src/common/constants/response-messages';

@Controller('posts')
export class PostController {
    constructor(private readonly postService : PostService){}

    @Post("/context")
    async saveContext(@Body() payload : CreatePostContextDto, @Res() res : Response){
        const response = await this.postService.saveContext(payload);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.POST.SAVE_CONTEXT,
            data : response
        })
    }

    @Post("/title")
    async saveTitle(@Body() payload : CreatePostTitleDto,@Res() res : Response ){
        const response = await this.postService.saveTitle(payload);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.POST.SAVE_TITLE,
            data : response
        })
    }
}
