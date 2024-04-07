import OpenAI from 'openai';
import {ChatCompletion, ChatCompletionMessageParam} from 'openai/resources';
import {Inject, Injectable, ServiceUnavailableException} from '@nestjs/common';
import { CreateChatGptDto } from './dtos/chatgpt-request.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatGptService{
    public openai: OpenAI;
    constructor(private configService : ConfigService){
        this.openai = new OpenAI({
            apiKey: this.configService.get("OPENAI_KEY"),
        });
    }

    async chatGptRequest(parameters : CreateChatGptDto): Promise<string> {
        try {
          // Convert message history to the format expected by the OpenAI API
          const history = parameters.messages.map(
            (message): ChatCompletionMessageParam => ({
              role: message.role ? 'assistant' : 'user',
              content: message.content,
            }),
          );
    
          // Make a request to the ChatGPT model
          const completion: ChatCompletion = await this.openai.chat.completions.create({
            model: parameters.model,
            messages: [
              {
                role: 'system',
                content: parameters.prompt,
              },
              ...history,
            ],
            temperature: Number(parameters.temperature),
            max_tokens: Number(parameters.max_tokens),
            frequency_penalty : Number(parameters.frequency_penalty),
            presence_penalty : Number(parameters.frequency_penalty),
            top_p : Number(parameters.top_p)
          });
    
          // Extract the content from the response
          const [content] = completion.choices.map((choice) => choice.message.content);
    
          return content;
        } catch (e) {
          // Log and propagate the error
          console.error(e);
          throw new ServiceUnavailableException('Failed request to ChatGPT');
        }
    }
}