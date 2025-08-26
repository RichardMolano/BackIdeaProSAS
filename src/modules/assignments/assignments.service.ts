import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "entities/assignment.entity";
import { ChatGroup } from "entities/chat-group.entity";
import { PqrTicket } from "entities/pqr-ticket.entity";
import { User } from "entities/user.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment) private asgRepo: Repository<Assignment>,
    @InjectRepository(ChatGroup) private chatRepo: Repository<ChatGroup>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(PqrTicket) private pqrRepo: Repository<PqrTicket>
  ) {}

  async listSolvers() {
    return this.usersRepo.find({
      where: { role: { name: In(["Solver", "Admin"] as any) } },
    });
  }

  async assign(
    adminRole: string | undefined,
    chat_group_id: string,
    solver_user_id: string
  ) {
    if (!(adminRole === "Admin" || adminRole === "Supervisor")) {
      throw new ForbiddenException("Requires Admin/Supervisor");
    }
    const chat = await this.chatRepo.findOne({
      where: { id: chat_group_id },
      relations: ["pqr"],
    });
    if (!chat) throw new NotFoundException("Chat not found");

    const solver = await this.usersRepo.findOne({
      where: { id: solver_user_id },
    });
    if (!solver) throw new NotFoundException("Solver not found");
    const pqr = await this.pqrRepo.findOne({ where: { id: chat.pqr.id } });
    const existing = await this.asgRepo.findOne({
      where: {
        chat_group: { id: chat_group_id },
        solver_user: { id: solver_user_id },
      },
    });
    if (existing) return existing;
    const asg = this.asgRepo.create({
      chat_group: chat,
      solver_user: solver,
      pqr: pqr!,
    });
    return this.asgRepo.save(asg);
  }

  async unassign(
    adminRole: string | undefined,
    chat_group_id: string,
    solver_user_id: string
  ) {
    if (!(adminRole === "Admin" || adminRole === "Supervisor")) {
      throw new ForbiddenException("Requires Admin/Supervisor");
    }
    const existing = await this.asgRepo.findOne({
      where: {
        chat_group: { id: chat_group_id },
        solver_user: { id: solver_user_id },
      },
    });
    if (!existing) throw new NotFoundException("Assignment not found");
    await this.asgRepo.remove(existing);
    return { ok: true };
  }
}
