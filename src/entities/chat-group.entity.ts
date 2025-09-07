import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { PqrTicket } from "./pqr-ticket.entity";
import { Message } from "./message.entity";
import { Assignment } from "./assignment.entity";

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => PqrTicket, (pqr) => pqr.chat_group, { onDelete: "CASCADE" })
  @JoinColumn()
  pqr!: PqrTicket;

  @Column({ type: "varchar", length: 20, default: "OPEN" })
  status!: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

  @Column({ type: "varchar", length: 20, default: "MEDIUM" })
  priority!: "LOW" | "MEDIUM" | "HIGH";

  @OneToMany(() => Message, (message) => message.chat_group)
  messages!: Message[];

  @OneToMany(() => Assignment, (a) => a.chat_group)
  assignments!: Assignment[];
}
