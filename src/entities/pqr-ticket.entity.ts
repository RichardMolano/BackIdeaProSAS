import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ChatGroup } from "./chat-group.entity";
import { Assignment } from "./assignment.entity";

export type PqrStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type PqrPriority = "LOW" | "MEDIUM" | "HIGH";

@Entity()
export class PqrTicket {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (u) => u.pqrTickets, { eager: true })
  @JoinColumn()
  client_user!: User;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 20, default: "OPEN" })
  status!: PqrStatus;

  @Column({ type: "varchar", length: 20, default: "MEDIUM" })
  priority!: PqrPriority;

  @CreateDateColumn()
  created_at!: Date;

  @OneToOne(() => ChatGroup, (cg) => cg.pqr, { cascade: true, eager: true })
  chat_group!: ChatGroup;

  @OneToMany(() => Assignment, (a) => a.pqr)
  assignments!: Assignment[];
}
