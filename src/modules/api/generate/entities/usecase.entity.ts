import {BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity("usecases")
export class Usecase{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({name:"name", nullable : false})
    name: string;

    @Column({default : uuidv4(), unique : true })
    usecaseId : string;

    @Column({name : "is_active", default : true, comment : "usecase is active or not" })
    isActive: boolean;

    @Column({name : "fields", type : "json", nullable : true , comment : "Frontend Fields"}) // [{label: "", "placeholder" :"", required : true, "key" : "content", min : 10, max : 100}]
    fields : JSON;

    @Column({name : "prompt", type : "text",nullable : true, comment : "OpenAI prompt"}) 
    prompt : string;

    @Column({ name : "prompt_fields", type:"json", nullable : true, comment : "Fields to be use while making prompt"})
    promptFields : JSON; // [{ prefix, key , postfix}]

    @Column({name : "model", type:"varchar", comment : "OpenAI model to be used",})
    model : string;

    @Column({ name : "temperature", type: "decimal", default: 0.7, precision: 6, scale: 2 })
    temperature: number;
    
    @Column({ name : "top_p", type: "decimal", default:1, precision: 6, scale: 2 })
    topP: number;
    
    @Column({ name : "max_tokens",  default : 256, type: "int"})
    maxTokens: number;

    @Column({ name : "frequency_penalty", type: "decimal", default: 0.7,  precision: 6, scale: 2 })
    frequencyPenalty: number;
    
    @Column({ name : "presence_penalty", type: "decimal", default: 0.7, precision: 6, scale: 2 })
    presencePenalty: number;

    @Column({ name : "stop_sequences", type : "varchar", nullable : true})
    stopSequences: number;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    setTokenValidity() {

    }    
}