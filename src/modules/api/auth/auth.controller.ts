import { BadRequestException, Body, Controller, Get, HttpStatus, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import {Response} from 'express';
import { EmailHelper } from 'src/helpers/emailHelper';
import { RESPONSE } from 'src/common/constants/response-messages';
import { TokenService } from '../token/token.service';
import { TokenType } from '../token/enums/token-type.enum';
import { ResetPasswordDto, UpdatePasswordDto } from './dtos/reset-password.dto';
import { LinkedinApiHelper } from 'src/helpers/linkedApiHelper';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
        private readonly userService : UsersService,
        private readonly emailHelper : EmailHelper,
        private readonly linkedinApiHelper : LinkedinApiHelper
    ){}

    @Post("sign-up")
    async createUser( @Req() request: Request, @Body() createUserDto : CreateUserDto, @Res() res : Response){
        const user = await this.userService.create(createUserDto);
        const token = await this.authService.generateToken(user, TokenType.VERIFY_EMAIL); // Email Verification token
        await this.emailHelper.sendVerificationEmail(createUserDto.name, createUserDto.email,token);
        return res.status(HttpStatus.CREATED).json({
            message : RESPONSE.USER.VERIFICATION_EMAIL_SENT,
            data : user
        });
    }


    @Post("/login")
    async login(@Body() userLoginDto : UserLoginDto,  @Res() res : Response){
        const user = await this.userService.checkUser(userLoginDto.email,userLoginDto.password);
        if(user.isEmailVerified == false){ // send the email again
            const token = await this.authService.generateToken(user, TokenType.VERIFY_EMAIL); // Email Verification token
            await this.emailHelper.sendVerificationEmail(user.name, user.email,token);
            return res.status(HttpStatus.ACCEPTED).json({ // request is incomplete
                message : RESPONSE.USER.VERIFICATION_EMAIL_SENT,
                data : user
            });
        }
        const token = await this.authService.generateToken(user, TokenType.ACCESS_TOKEN);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.SUCCESS,
            data : {
                accessToken : token
            }
        });
    }

    @Post("/verify-email")
    async verifyEmail(@Query('token') token: string,  @Res() res : Response){
        const user = await this.authService.verifyToken(token, TokenType.VERIFY_EMAIL);
        await this.userService.verifyEmail(user.userId);
        // generate new access Token
        const accessToken = await this.authService.generateToken({id : user.userId, email:user.email},TokenType.ACCESS_TOKEN);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.USER.EMAIL_VERIFIED,
            data : {
                accessToken
            }
        });
    }

    @Post("/reset-password")
    async resetPassword(@Body() resetPasswordDto : ResetPasswordDto, @Res() res : Response){
        const user = await this.userService.getUserByEmail(resetPasswordDto.email);
        const token = await this.authService.generateToken(user,TokenType.RESET_PASSWORD);
        await this.emailHelper.resetPasswordEmail(user.name,user.email,token);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.USER.RESET_PASSWORD_EMAIL,
            data : {
                email : user.email
            }
        });
    }

    @Patch("/update-password")
    async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto , @Res() res : Response){
        const user = await this.authService.verifyToken(updatePasswordDto.token,TokenType.RESET_PASSWORD);
        await this.userService.updatePassword(user.userId,updatePasswordDto.newPassword);
        return res.status(HttpStatus.OK).json({
            message : RESPONSE.USER.PASSWORD_UPDATED,
            data : {
                email : user.email
            }
        });
    }

    @Get("/linkedin")
    async redirectToLinkedinAuth(@Req() req : Request, @Res() res : Response){
        const frontendUrl = req.headers["referer"];
        const redirectUrl = this.linkedinApiHelper.getConnectUrl(frontendUrl);
        return res.status(HttpStatus.OK).json({
            redirectUrl
        }) // redirect to linkedin Auth Page
    }

    @UseGuards()
    @Get("/linkedin/callback")
    async getAccessToken(@Req() req : Request, @Query("code") code : string, @Query("userId") userId : number, @Res() res : Response){
        try{
            const frontendUrl = req.headers["referer"];
            console.log("code ", code);
            if (!code) {
                throw new BadRequestException("Please send the code.")
            }
            // step 2 : get access token via code
            const tokenInfo : any = await this.linkedinApiHelper.getAccessToken(frontendUrl, code);
            // Step 3: Use access token to get user information
            const profileInfo : any = await this.linkedinApiHelper.getUserInfoByAccessToken(tokenInfo);

            // store the info in linkedin table
            this.userService.saveLinkedinInfo({
                accessToken : tokenInfo.access_token,
                expiresIn : tokenInfo.expires_in,
                name : profileInfo.name,
                email : profileInfo.email,
                isEmailVerified : true, //profileInfo.isEmailVerified,
                metaData : {tokenInfo, profileInfo},
                userId,
                personId: profileInfo.sub
            })


            // this.userService.saveLinkedinInfo({
            //     accessToken : tokenInfo.access_token,
            //     expiresIn : tokenInfo.expires_in,
            //     name : "rjan",//profileInfo.name,
            //     email : "rajan@fmail.com", // profileInfo.email,
            //     isEmailVerified : true, //profileInfo.isEmailVerified,
            //     metaData : {tokenInfo},
            //     userId
            // })
            // this.userService.verifyLinkedin(userId);
            return res.status(HttpStatus.OK).json({
                message : RESPONSE.USER.LINKEDIN_SUCCESS,
                data : {isLinkedinConnected : true}
            });
        }catch(err){
            console.log("Error ---> ", err.message);
            return res.status(HttpStatus.OK).json({
                message : RESPONSE.USER.LINKEDIN_FAILED,
                data : {isLinkedinConnected : true}
            });
        }
    }

}
