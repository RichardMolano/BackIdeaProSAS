import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatGroup } from "../../entities/chat-group.entity";
import { PqrTicket } from "../../entities/pqr-ticket.entity";
import { User } from "../../entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class PqrService {
  constructor(
    @InjectRepository(PqrTicket) private pqrRepo: Repository<PqrTicket>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(ChatGroup) private chatRepo: Repository<ChatGroup>
  ) {}

  async createPqr(
    clientUserId: string,
    title: string,
    description: string,
    priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM"
  ) {
    const user = await this.usersRepo.findOne({ where: { id: clientUserId } });
    if (!user) throw new NotFoundException("User not found");
    const pqr = this.pqrRepo.create({
      client_user: user,
      title,
      description,
      priority,
      status: "OPEN",
    });
    const saved = await this.pqrRepo.save(pqr);
    const chat = this.chatRepo.create({ pqr: saved, status: "OPEN", priority });
    await this.chatRepo.save(chat);
    // reload with chat
    return this.pqrRepo.findOne({
      where: { id: saved.id },
      relations: ["chat_group"],
    });
  }

  async mine(userId: string) {
    return this.pqrRepo.find({
      where: { client_user: { id: userId } },
      order: { created_at: "DESC" },
      relations: ["chat_group"],
    });
  }

  async getById(userId: string, id: string) {
    const pqr = await this.pqrRepo.findOne({
      where: { id },
      relations: ["chat_group"],
    });
    if (!pqr) throw new NotFoundException("Not found");
    if (pqr.client_user.id !== userId) throw new NotFoundException("Not found");
    return pqr;
  }
}
