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
import type { User } from "./user.entity";
import type { ChatGroup } from "./chat-group.entity";
import type { Assignment } from "./assignment.entity";
import type { Dependence } from "./dependence.entity";
import { ApiProperty } from "@nestjs/swagger";

export type PqrStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type PqrPriority = "LOW" | "MEDIUM" | "HIGH";

@Entity()
export class PqrTicket {
  @ApiProperty({ example: "uuid-ticket" })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({ type: () => require("./user.entity").User })
  @ManyToOne(() => require("./user.entity").User, (u: any) => u.pqrTickets, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client_user!: User;

  @ApiProperty({ example: "Problema con el servicio" })
  @Column({ type: "varchar", length: 200 })
  title!: string;

  @ApiProperty({ example: "Descripción detallada del problema" })
  @Column({ type: "text" })
  description!: string;

  @ApiProperty({
    example: "OPEN",
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
  })
  @Column({ type: "varchar", length: 20, default: "OPEN" })
  status!: PqrStatus;

  @ApiProperty({ example: "MEDIUM", enum: ["LOW", "MEDIUM", "HIGH"] })
  @Column({ type: "varchar", length: 20, default: "MEDIUM" })
  priority!: PqrPriority;

  @ApiProperty({ example: "2024-06-01T12:00:00Z" })
  @CreateDateColumn()
  created_at!: Date;

  @ApiProperty({ type: () => require("./chat-group.entity").ChatGroup })
  @OneToOne(
    () => require("./chat-group.entity").ChatGroup,
    (cg: any) => cg.pqr,
    { cascade: true, eager: true }
  )
  chat_group!: ChatGroup;

  @ApiProperty({ type: () => [require("./assignment.entity").Assignment] })
  @OneToMany(() => require("./assignment.entity").Assignment, (a: any) => a.pqr)
  assignments!: Assignment[];

  @ApiProperty({ type: () => require("./dependence.entity").Dependence })
  @ManyToOne(
    () => require("./dependence.entity").Dependence,
    (d: any) => d.pqrs,
    { eager: true }
  )
  @JoinColumn({ name: "dependence_id" })
  dependence!: Dependence;
}
