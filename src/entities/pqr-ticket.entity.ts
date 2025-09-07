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
import { Dependence } from "./dependence.entity";
import { ApiProperty } from "@nestjs/swagger";

export type PqrStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type PqrPriority = "LOW" | "MEDIUM" | "HIGH";

@Entity()
export class PqrTicket {
  @ApiProperty({ example: "uuid-ticket" })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (u) => u.pqrTickets, {
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

  @ApiProperty({ type: () => ChatGroup })
  @OneToOne(() => ChatGroup, (cg) => cg.pqr, { cascade: true, eager: true })
  chat_group!: ChatGroup;

  @ApiProperty({ type: () => [Assignment] })
  @OneToMany(() => Assignment, (a) => a.pqr)
  assignments!: Assignment[];

  @ApiProperty({ type: () => Dependence })
  @ManyToOne(() => Dependence, (d) => d.pqrs, { eager: true })
  @JoinColumn({ name: "dependence_id" })
  dependence!: Dependence;
}
