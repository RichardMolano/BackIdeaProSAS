import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import type { User } from "./user.entity";

@Entity()
export class Role {
  @ApiProperty({
    example: "r1a2b3c4-d5e6-7890-abcd-1234567890ef",
    description: "ID único del rol",
  })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({
    example: "Admin",
    enum: ["Admin", "Client", "Solver", "Supervisor"],
    description: "Nombre único del rol",
  })
  @Column({ type: "varchar", length: 32, unique: true })
  name!: "Admin" | "Client" | "Solver" | "Supervisor";

  @ApiProperty({
    type: () => [require("./user.entity").User],
    description: "Usuarios asociados al rol",
    isArray: true,
    required: false,
    nullable: true,
  })
  @OneToMany(() => require("./user.entity").User, (u: any) => u.role)
  users!: User[];
}
