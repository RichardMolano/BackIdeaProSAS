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

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => PqrTicket, (p) => p.chat_group)
  @JoinColumn()
  pqr!: PqrTicket;

  @Column({ type: "varchar", length: 20, default: "OPEN" })
  status!: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

  @Column({ type: "varchar", length: 20, default: "MEDIUM" })
  priority!: "LOW" | "MEDIUM" | "HIGH";

  @OneToMany(() => Message, (m) => m.chat_group)
  messages!: Message[];
}
