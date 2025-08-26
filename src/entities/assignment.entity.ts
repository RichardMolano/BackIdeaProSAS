import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { PqrTicket } from "./pqr-ticket.entity";
import { ChatGroup } from "./chat-group.entity";
import { User } from "./user.entity";

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => PqrTicket, (p) => p.assignments, { eager: true })
  @JoinColumn()
  pqr!: PqrTicket;

  @ManyToOne(() => ChatGroup, (cg) => cg.messages, { eager: true })
  @JoinColumn()
  chat_group!: ChatGroup;
  /*
  @Column({ type: "varchar", length: 100, nullable: true })
dependencia!: string | null;
*/

  @ManyToOne(() => User, (u) => u.assignments, { eager: true })
  @JoinColumn()
  solver_user!: User;

  @CreateDateColumn()
  created_at!: Date;
}
