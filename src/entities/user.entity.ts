import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import type { Role } from "./role.entity";
import type { PqrTicket } from "./pqr-ticket.entity";
import type { Message } from "./message.entity";
import type { Assignment } from "./assignment.entity";
import type { Dependence } from "./dependence.entity";

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
    type: () => require("./role.entity").Role,
    description: "Rol del usuario",
    required: true,
  })
  @ManyToOne(() => require("./role.entity").Role, (r: any) => r.users, {
    eager: true,
  })
  @JoinColumn()
  role!: Role;

  @ApiProperty({
    type: () => [require("./pqr-ticket.entity").PqrTicket],
    description: "PQRs creadas por el usuario",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(
    () => require("./pqr-ticket.entity").PqrTicket,
    (p: any) => p.client_user
  )
  pqrTickets!: PqrTicket[];

  @ApiProperty({
    type: () => [require("./message.entity").Message],
    description: "Mensajes enviados por el usuario",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => require("./message.entity").Message, (m: any) => m.user)
  messages!: Message[];

  @ApiProperty({
    type: () => [require("./assignment.entity").Assignment],
    description: "Asignaciones del usuario como solucionador",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(
    () => require("./assignment.entity").Assignment,
    (a: any) => a.solver_user
  )
  assignments!: Assignment[];

  @ApiProperty({
    type: () => require("./dependence.entity").Dependence,
    description: "Dependencia asociada al usuario",
    required: false,
    nullable: true,
  })
  @ManyToOne(
    () => require("./dependence.entity").Dependence,
    (d: any) => d.users,
    {
      nullable: true,
      onDelete: "SET NULL",
    }
  )
  @JoinColumn({ name: "dependence_id" })
  dependence?: Dependence | null;
}
