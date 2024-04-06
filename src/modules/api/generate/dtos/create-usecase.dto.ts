import { IsEmail, IsJSON, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUsecaseDto{
    
    @IsNotEmpty()
    name : string;

    @IsJSON()
    fields : JSON;

    @IsJSON()
    prompt : JSON;

    @IsJSON()
    promptFields : JSON;

    @IsNotEmpty()
    password:string;
}