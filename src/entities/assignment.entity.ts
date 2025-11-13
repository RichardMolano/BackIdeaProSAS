import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import type { PqrTicket } from "./pqr-ticket.entity";
import type { ChatGroup } from "./chat-group.entity";
import type { User } from "./user.entity";

@Entity()
export class Assignment {
  @ApiProperty({
    example: "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
    description: "ID único de la asignación",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    type: () => require("./pqr-ticket.entity").PqrTicket,
    description: "PQR asignada",
    required: true,
  })
  @ManyToOne(
    () => require("./pqr-ticket.entity").PqrTicket,
    (p: any) => p.assignments,
    { eager: true }
  )
  @JoinColumn()
  pqr!: PqrTicket;

  @ApiProperty({
    type: () => require("./chat-group.entity").ChatGroup,
    description: "Grupo de chat asociado",
    required: true,
  })
  @ManyToOne(
    () => require("./chat-group.entity").ChatGroup,
    (cg: any) => cg.messages,
    { eager: true }
  )
  @JoinColumn()
  chat_group!: ChatGroup;

  /*
  @ApiProperty({ example: 'Recursos Humanos', description: 'Dependencia asociada', required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  dependencia!: string | null;
  */

  @ApiProperty({
    type: () => require("./user.entity").User,
    description: "Usuario solucionador",
    required: true,
  })
  @ManyToOne(
    () => require("./user.entity").User,
    (user: any) => user.assignments,
    { onDelete: "CASCADE" }
  )
  @JoinColumn()
  solver_user!: User;

  @ApiProperty({
    example: "2025-09-07T12:34:56.789Z",
    description: "Fecha de creación de la asignación",
  })
  @CreateDateColumn()
  created_at!: Date;
}
