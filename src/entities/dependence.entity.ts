import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PqrTicket } from "./pqr-ticket.entity";
import { Message } from "./message.entity";
import { Assignment } from "./assignment.entity";
import { User } from "./user.entity";

@Entity("dependences")
export class Dependence {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @OneToMany(() => User, (u) => u.dependence, { cascade: false })
  users!: User[];

  @OneToMany(() => PqrTicket, (p) => p.dependence, { cascade: false })
  pqrs!: PqrTicket[];
}
