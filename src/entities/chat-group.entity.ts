import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import type { PqrTicket } from "./pqr-ticket.entity";
import type { Message } from "./message.entity";
import type { Assignment } from "./assignment.entity";

@Entity()
export class ChatGroup {
  @ApiProperty({
    example: "c1d2e3f4-5678-90ab-cdef-1234567890ab",
    description: "ID único del grupo de chat",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    type: () => require("./pqr-ticket.entity").PqrTicket,
    description: "PQR asociada al grupo de chat",
    required: true,
  })
  @OneToOne(
    () => require("./pqr-ticket.entity").PqrTicket,
    (pqr: any) => pqr.chat_group,
    { onDelete: "CASCADE" }
  )
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
    type: () => [require("./message.entity").Message],
    description: "Mensajes asociados al grupo de chat",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(
    () => require("./message.entity").Message,
    (message: any) => message.chat_group
  )
  messages!: Message[];

  @ApiProperty({
    type: () => [require("./assignment.entity").Assignment],
    description: "Asignaciones asociadas al grupo de chat",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(
    () => require("./assignment.entity").Assignment,
    (a: any) => a.chat_group
  )
  assignments!: Assignment[];
}
