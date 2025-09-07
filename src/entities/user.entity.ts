import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Role } from "./role.entity";
import { PqrTicket } from "./pqr-ticket.entity";
import { Message } from "./message.entity";
import { Assignment } from "./assignment.entity";
import { Dependence } from "./dependence.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password_hash!: string;

  /*
  @Column({ type: "varchar", length: 100, nullable: true })
dependence!: string | null;
  */

  @ManyToOne(() => Role, (r) => r.users, { eager: true })
  @JoinColumn()
  role!: Role;

  @OneToMany(() => PqrTicket, (p) => p.client_user)
  pqrTickets!: PqrTicket[];

  @OneToMany(() => Message, (m) => m.user)
  messages!: Message[];

  @OneToMany(() => Assignment, (a) => a.solver_user)
  assignments!: Assignment[];

  @ManyToOne(() => Dependence, (d) => d.users, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "dependence_id" })
  dependence?: Dependence | null;
}
