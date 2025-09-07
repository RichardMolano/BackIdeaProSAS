import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ChatGroup } from "./chat-group.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Message {
  @ApiProperty({ example: "uuid-message" })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({ type: () => ChatGroup })
  @ManyToOne(() => ChatGroup, (chatGroup) => chatGroup.messages, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  chat_group!: ChatGroup;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.messages, {
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  user!: User;

  @ApiProperty({ example: "Contenido del mensaje" })
  @Column({ type: "text" })
  content!: string;

  @ApiProperty({ example: "https://example.com/file.pdf", required: false })
  @Column({ type: "varchar", length: 500, nullable: true })
  file_url?: string | null;

  @ApiProperty({ example: "pdf", required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  file_type?: string | null;

  @ApiProperty({ example: "2024-06-01T12:00:00Z" })
  @CreateDateColumn()
  created_at!: Date;
}
