import {BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import * as moment from 'moment/moment';
import {TokenType} from '../enums/token-type.enum';
import { DEFAULT_TOKEN_VALIDITY_DURATION } from 'src/common/constants/app.constants';

@Entity("tokens")
export class Token{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({nullable : false})
    @Index()
    userId : number;

    @Column({nullable:false})
    token : string;

    @Column({default : TokenType.ACCESS_TOKEN})
    type : TokenType;

    @Column({default : false})
    revoked : boolean;

    @Column()
    expiresAt : Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    setTokenValidity() {
        this.expiresAt = moment()
        .add(DEFAULT_TOKEN_VALIDITY_DURATION, 'seconds')
        .toDate();
    }
}