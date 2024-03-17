import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto{
    @IsNotEmpty()
    token:string;
    
    @IsNotEmpty()
    newPassword:string;

}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
