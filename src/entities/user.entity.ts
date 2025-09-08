import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "./role.entity";
import { PqrTicket } from "./pqr-ticket.entity";
import { Message } from "./message.entity";
import { Assignment } from "./assignment.entity";
import { Dependence } from "./dependence.entity";

@Entity()
export class User {
  @ApiProperty({
    example: "u1a2b3c4-d5e6-7890-abcd-1234567890ef",
    description: "ID único del usuario",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    example: "usuario@correo.com",
    description: "Correo electrónico único del usuario",
  })
  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @ApiProperty({
    example: "hash1234567890abcdef",
    description: "Hash de la contraseña del usuario",
  })
  @Column({ type: "varchar", length: 255 })
  password_hash!: string;

  /*
  @ApiProperty({ example: 'Recursos Humanos', description: 'Dependencia asociada', required: false })
  @Column({ type: "varchar", length: 100, nullable: true })
  dependence!: string | null;
  */

  @ApiProperty({
    type: () => Role,
    description: "Rol del usuario",
    required: true,
  })
  @ManyToOne(() => Role, (r) => r.users, { eager: true })
  @JoinColumn()
  role!: Role;

  @ApiProperty({
    type: () => [PqrTicket],
    description: "PQRs creadas por el usuario",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => PqrTicket, (p) => p.client_user)
  pqrTickets!: PqrTicket[];

  @ApiProperty({
    type: () => [Message],
    description: "Mensajes enviados por el usuario",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => Message, (m) => m.user)
  messages!: Message[];

  @ApiProperty({
    type: () => [Assignment],
    description: "Asignaciones del usuario como solucionador",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => Assignment, (a) => a.solver_user)
  assignments!: Assignment[];

  @ApiProperty({
    type: () => Dependence,
    description: "Dependencia asociada al usuario",
    required: false,
    nullable: true,
  })
  @ManyToOne(() => Dependence, (d) => d.users, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "dependence_id" })
  dependence?: Dependence | null;
}
