import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, Length } from "class-validator";

export class CreatePostContextDto{
    @IsNumber()
    userId : number;
    
    @IsString()
    @IsNotEmpty()
    @Length(10,200,{message : "Context length should contain 10 - 200 character"})
    @Transform(({ value }) => value?.trim()) // Trim only if value exists
    context : string;
}

export class CreatePostTitleDto{
    @IsNumber()
    userId : number;

    @IsString()
    @IsNotEmpty()
    postId : string;
    
    @IsString()
    @IsNotEmpty()
    @Length(10,200,{message : "Title length should contain 10 - 200 character"})
    @Transform(({ value }) => value?.trim()) // Trim only if value exists
    title : string;
}