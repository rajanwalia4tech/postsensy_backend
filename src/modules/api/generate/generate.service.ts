import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsecaseRepository } from './repositories/usecase.repository';
import { ChatGptService } from './chatgpt.service';
import { CreateChatGptDto } from './dtos/chatgpt-request.dto';

@Injectable()
export class GenerateService {

    constructor(
        private readonly usecaseRepository : UsecaseRepository,
        private readonly chatGptService : ChatGptService
    ){}

    async getActiveUsecases(){
        const usecases = await this.usecaseRepository.find({ where:{isActive : true}, select : ["name","usecaseId","fields"]});
        return {usecases};
    }

    async getUsecaseById(usecaseId: string){
        const usecase = await this.usecaseRepository.findOne({ where:{isActive : true, usecaseId}});
        if(!usecase)
            throw new HttpException("Invalid usecaseId",HttpStatus.BAD_REQUEST);
        return usecase;
    }


    validatePayload(payload : any, usecase : any){
        const payloadFields = {...payload};
        delete payloadFields.usecaseId;
        for(let field of usecase.fields){
            if(!payloadFields.hasOwnProperty(field.key)){
                throw new HttpException(`${field.key} is required`,HttpStatus.BAD_REQUEST);
            }
        }
        return true;
    }

    async generate(payload : any){
        const usecase = await this.getUsecaseById(payload.usecaseId);
        this.validatePayload(payload,usecase);
        const chatGptPayload = this.createChatgptPayload(payload,usecase);
        const response = await this.chatGptService.chatGptRequest(chatGptPayload);
        const serializeResponse = this.serializeResponse(usecase,response);
        return {output : serializeResponse};
    }

    serializeResponse(usecase,response) : Array<string>{
        let result : any = [];
        result = this.cleanResponse(usecase,response);
        result = this.addWordCount(result);
        return result;
    }

    addWordCount(array : Array<string>){
        let res = [];
        for(let str of array){
            res.push({
                text : str,
                words : this.countWords(str)
            })
        }
        return res;
    }

    countWords(str : string) {
        // Regular expression to match word characters
        const wordPattern = /\S+/g;
        // Match all words and return the length of the array
        return str.match(wordPattern)?.length || 0;
    }

    cleanResponse(usecase,response: string) : Array<string>{
        let result : any = response;
        switch(usecase.usecaseId){
            case "title-generation":
                result = this.splitByNewline(result);
                result = this.removeHyphenFromStart(result);
                break;
            case "post-generation": 
                break;
        }
        result = this.makeArray(result);
        return result;
    }

    splitByNewline(response : string) : Array<string>{
        let result = response.split("\n");
        return result;
    }

    makeArray(response : Array<string> | string) : Array<string>{
        if(Array.isArray(response)) return response;
        return [response];
    }

    removeHyphenFromStart(strings : Array<string>) : Array<string>{
        const pattern = /^\-/; // Matches a hyphen at the beginning of the string
        return strings.map(str => str.replace(pattern, "").trim());
    }

    createChatgptPayload(payload,usecase) : CreateChatGptDto{
        let content = "";
        usecase.promptFields
        .map((field)=>{
            content += field.prefix + payload[field.key] + field.postfix + "\n"
        })
        content = content.trim();
        let chatGptPayload = {
            model : usecase.model,
            prompt : usecase.prompt,
            messages : [
                {
                    role : "user",
                    content
                }
            ],
            temperature : usecase.temperature,
            top_p : usecase.topP,
            max_tokens : usecase.maxTokens,
            frequency_penalty : usecase.frequencyPenalty,
            presence_penalty : usecase.presencePenalty,
        }

        return chatGptPayload;
    }

}   
