import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

class MessageDto{
    role : string;
    content : string;
}

export class CreateChatGptDto{
    
    @IsNotEmpty()
    model: string;

    @IsString()
    prompt: string;

    @IsArray()
    messages : Array<MessageDto>;

    @IsString()
    temperature : string;

    @IsNumber()
    max_tokens : number;

    @IsString()
    top_p : string;

    @IsString()
    frequency_penalty : string;

    @IsString()
    presence_penalty : string;
}
