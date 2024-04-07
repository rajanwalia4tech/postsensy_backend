// post.entity.ts
import { IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn({name : "id"})
  id: number;

  @Index("post_id_idx")
  @Column({name : "post_id", unique : true, length:40, default : uuidv4()})
  postId : string;

  @Index("user_id_idx")
  @Column({ name : "user_id", nullable: false })
  userId: number;

  @Column({name : "context", length: 500,  type: 'varchar', nullable: true })
  @IsNotEmpty({ message: 'Context is required' })
  context: string;

  @Column({ name : "title", length: 500, type: 'varchar', nullable: true })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @Column({ name : "content", type: 'text', nullable: true })
  content: string;

  @Column({name : "scheduled_at", default : null})
  scheduledAt: Date;

  @Column({name :"deletedAt", default : null })
  deletedAt : Date;

  @CreateDateColumn({name : "created_at"})
  createdAt: Date;

  @UpdateDateColumn({name : "updated_at"})
  updatedAt: Date;
}
