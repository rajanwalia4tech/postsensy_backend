import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repositories/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { TokenValidationMiddleware } from 'src/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Post
    ])
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, JwtService]
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .forRoutes(PostController);
  }
}
