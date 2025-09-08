import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PqrTicket } from "./pqr-ticket.entity";
import { Message } from "./message.entity";
import { Assignment } from "./assignment.entity";

@Entity()
export class ChatGroup {
  @ApiProperty({
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    description: "ID único del grupo de chat",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    type: () => PqrTicket,
    description: "PQR asociada al grupo de chat",
    required: true,
  })
  @OneToOne(() => PqrTicket, (pqr) => pqr.chat_group, { onDelete: "CASCADE" })
  @JoinColumn()
  pqr!: PqrTicket;

  @ApiProperty({
    example: "OPEN",
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    description: "Estado del grupo de chat",
  })
  @Column({ type: "varchar", length: 20, default: "OPEN" })
  status!: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

  @ApiProperty({
    example: "MEDIUM",
    enum: ["LOW", "MEDIUM", "HIGH"],
    description: "Prioridad del grupo de chat",
  })
  @Column({ type: "varchar", length: 20, default: "MEDIUM" })
  priority!: "LOW" | "MEDIUM" | "HIGH";

  @ApiProperty({
    type: () => [Message],
    description: "Mensajes asociados al grupo de chat",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => Message, (message) => message.chat_group)
  messages!: Message[];

  @ApiProperty({
    type: () => [Assignment],
    description: "Asignaciones asociadas al grupo de chat",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => Assignment, (a) => a.chat_group)
  assignments!: Assignment[];
}
