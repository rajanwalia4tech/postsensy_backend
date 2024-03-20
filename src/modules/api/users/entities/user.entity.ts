import {Column, CreateDateColumn, Entity, TableForeignKey, Index, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { UserRole } from '../enums/user.enum';
import { LinkedinInfo } from './linkedin.entity';

@Entity()
export class User{
    @PrimaryGeneratedColumn({name : "id"})
    id : number;

    // @OneToOne(() => LinkedinInfo)
    // @JoinColumn({referencedColumnName : "id", name : "linkedin_id"})
    @Column({unique : true, name: "linkedin_id"})
    linkedinId: number

    @Column({name : "name", nullable:false})
    name : string;

    @Column({name : "email", unique:true})
    email: string;

    @Column({name : "is_email_verified",default:false})
    isEmailVerified : boolean;

    @Column({name : "is_linkedin_connected", default:false})
    isLinkedinConnected : boolean;

    @Column({name : "is_blocked", default:false})
    isBlocked : boolean;

    @Column({name : "role", default : UserRole.USER})
    role : UserRole;

    @Column({name : "company_name", nullable:true})
    companyName : string;

    @Column({name : "password", nullable:false})
    password : string;

    @CreateDateColumn({name : "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
}
