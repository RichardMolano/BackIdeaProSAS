import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import type { PqrTicket } from "./pqr-ticket.entity";
import type { User } from "./user.entity";

@Entity("dependences")
export class Dependence {
  @ApiProperty({
    example: "b1a2c3d4-e5f6-7890-abcd-1234567890ef",
    description: "ID único de la dependencia",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    example: "Recursos Humanos",
    description: "Nombre único de la dependencia",
  })
  @Column({ type: "varchar", unique: true })
  name!: string;

  @ApiProperty({
    type: () => [require("./user.entity").User],
    description: "Usuarios asociados a la dependencia",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => require("./user.entity").User, (u: any) => u.dependence, {
    cascade: false,
  })
  users!: User[];

  @ApiProperty({
    type: () => [require("./pqr-ticket.entity").PqrTicket],
    description: "PQRs asociadas a la dependencia",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(
    () => require("./pqr-ticket.entity").PqrTicket,
    (p: any) => p.dependence,
    { cascade: false }
  )
  pqrs!: PqrTicket[];
}
