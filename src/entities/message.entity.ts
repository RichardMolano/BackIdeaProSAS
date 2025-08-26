import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { ChatGroup } from "./chat-group.entity";
import { User } from "./user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => ChatGroup, (cg) => cg.messages, { eager: true })
  @JoinColumn()
  chat_group!: ChatGroup;

  @ManyToOne(() => User, (u) => u.messages, { eager: true })
  @JoinColumn()
  sender_user!: User;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "text", nullable: true })
  file_url?: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  file_type?: string | null;

  @CreateDateColumn()
  created_at!: Date;
}
