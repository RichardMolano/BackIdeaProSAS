import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { PqrTicket } from "./pqr-ticket.entity";
import { ChatGroup } from "./chat-group.entity";
import { User } from "./user.entity";

@Entity()
export class Assignment {
  @ApiProperty({
    example: "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
    description: "ID único de la asignación",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    type: () => PqrTicket,
    description: "PQR asignada",
    required: true,
  })
  @ManyToOne(() => PqrTicket, (p) => p.assignments, { eager: true })
  @JoinColumn()
  pqr!: PqrTicket;

  @ApiProperty({
    type: () => ChatGroup,
    description: "Grupo de chat asociado",
    required: true,
  })
  @ManyToOne(() => ChatGroup, (cg) => cg.messages, { eager: true })
  @JoinColumn()
  chat_group!: ChatGroup;

  /*
  @ApiProperty({ example: 'Recursos Humanos', description: 'Dependencia asociada', required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  dependencia!: string | null;
  */

  @ApiProperty({
    type: () => User,
    description: "Usuario solucionador",
    required: true,
  })
  @ManyToOne(() => User, (user) => user.assignments, { onDelete: "CASCADE" })
  @JoinColumn()
  solver_user!: User;

  @ApiProperty({
    example: "2025-09-07T12:34:56.789Z",
    description: "Fecha de creación de la asignación",
  })
  @CreateDateColumn()
  created_at!: Date;
}
