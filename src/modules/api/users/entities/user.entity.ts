import {Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { UserRole } from '../enums/user.enum';

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({nullable:false})
    name : string;

    @Column({unique:true})
    email: string;

    @Column({default:false})
    isEmailVerified : boolean;

    @Column({default:false})
    isBlocked : boolean;

    @Column({default : UserRole.USER})
    role : UserRole;

    @Column({nullable:true})
    companyName : string;

    @Column({nullable:false})
    password : string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}