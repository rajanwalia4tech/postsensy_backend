import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { UserRole } from '../enums/user.enum';

@Entity()
export class LinkedinInfo{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({unique : true})
    userId : number;

    @Column({nullable:false})
    accessToken : string;

    @Column({nullable:false})
    name : string;

    @Column()
    email: string;

    @Column({default:false})
    isEmailVerified : boolean;

    @Column({default:null})
    expires_in : number;

    @Column("json")
    metaData : JSON;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}