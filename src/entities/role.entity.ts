import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 32, unique: true })
  name!: "Admin" | "Client" | "Solver" | "Supervisor";

  @OneToMany(() => User, (u) => u.role)
  users!: User[];
}
