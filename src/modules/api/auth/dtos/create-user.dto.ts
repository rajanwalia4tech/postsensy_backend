import { IsEmail, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";

export class CreateUserDto{
    
    @IsNotEmpty()
    name : string;

    @IsEmail()
    email : string;

    @IsOptional()
    companyName : string;

    @IsNotEmpty()
    password:string;
}