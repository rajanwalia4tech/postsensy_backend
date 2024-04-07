import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './repositories/post.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { TokenValidationMiddleware } from 'src/middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { LinkedinApiHelper } from 'src/helpers/linkedApiHelper';
import { AxiosHelper } from 'src/helpers/axiosHelper';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Post
    ]),
    UsersModule
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, JwtService, LinkedinApiHelper,AxiosHelper]
})
export class PostModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .forRoutes(PostController);
  }
}
