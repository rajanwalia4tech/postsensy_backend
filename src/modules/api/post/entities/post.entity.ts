// post.entity.ts
import { IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn({name : "id"})
  id: number;

  @Index("post_id_idx")
  @Column({name : "post_id", unique : true, length:40, generated : 'uuid'})
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

  @Column({ name : "error", type: 'text', nullable: true })
  error: string;

  @Column({name : "scheduled_at", default : null})
  scheduledAt: Date;

  @Column({name : "published_at", default : null})
  publishedAt: Date;

  @Column({name :"deletedAt", default : null })
  deletedAt : Date;

  @CreateDateColumn({name : "created_at", type:"datetime"})
  createdAt: Date;

  @UpdateDateColumn({name : "updated_at",type:"datetime"})
  updatedAt: Date;
}
