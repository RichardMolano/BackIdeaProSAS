import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "entities/assignment.entity";
import { ChatGroup } from "entities/chat-group.entity";
import { Message } from "entities/message.entity";
import { PqrTicket } from "entities/pqr-ticket.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatGroup) private chatRepo: Repository<ChatGroup>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(PqrTicket) private pqrRepo: Repository<PqrTicket>,
    @InjectRepository(Assignment) private asgRepo: Repository<Assignment>
  ) {}

  async listGroupsForUser(userId: string) {
    // Groups where user is owner of PQR or assigned as solver
    const assigned = await this.asgRepo.find({
      where: { solver_user: { id: userId } },
    });
    const assignedGroupIds = assigned.map((a) => a.chat_group.id);
    const pqrs = await this.pqrRepo.find({
      where: { client_user: { id: userId } },
    });
    const ownedGroupIds = pqrs
      .map((p) => p.chat_group?.id)
      .filter(Boolean) as string[];
    const ids = Array.from(new Set([...assignedGroupIds, ...ownedGroupIds]));
    if (!ids.length) return [];
    return this.chatRepo.find({ where: { id: In(ids) } });
  }
  async listAllGroups() {
    return this.chatRepo.find();
  }

  async listMessages(userId: string, groupId: string) {
    await this.ensureAccess(userId, groupId);
    return this.msgRepo.find({
      where: { chat_group: { id: groupId } },
      order: { created_at: "ASC" },
    });
  }

  async listAllMessages(groupId: string) {
    return this.msgRepo.find({
      where: { chat_group: { id: groupId } },
      order: { created_at: "ASC" },
    });
  }

  async sendMessage(
    userId: string,
    groupId: string,
    content: string,
    file_url?: string,
    file_type?: string
  ) {
    await this.ensureAccess(userId, groupId);
    const isActive = await this.isChatActive(groupId);
    if (!isActive) throw new ForbiddenException("Chat is not active");
    const entity = this.msgRepo.create({
      chat_group: { id: groupId } as any,
      sender_user: { id: userId } as any,
      content,
      file_url: file_url || null,
      file_type: file_type || null,
    });
    return this.msgRepo.save(entity);
  }

  async isChatActive(groupId: string): Promise<boolean> {
    const group = await this.chatRepo.findOne({
      where: { id: groupId },
    });
    if (!group) throw new NotFoundException("Chat group not found");
    return group.status === "OPEN" || group.status === "IN_PROGRESS";
  }

  private async ensureAccess(userId: string, groupId: string) {
    const group = await this.chatRepo.findOne({
      where: { id: groupId },
      relations: ["pqr", "pqr.client_user"],
    });
    if (!group) throw new NotFoundException("Chat group not found");
    const isOwner = group.pqr.client_user.id === userId;
    if (isOwner) return;
    const assigned = await this.asgRepo.findOne({
      where: { chat_group: { id: groupId }, solver_user: { id: userId } },
    });
    if (!assigned) throw new ForbiddenException("No access to this chat");
  }

  async setGroupStatus(
    userId: string,
    groupId: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) {
    const group = await this.chatRepo.findOne({
      where: { id: groupId },
      relations: ["pqr", "pqr.client_user"],
    });
    if (!group) throw new NotFoundException("Chat group not found");

    const assigned = await this.asgRepo.findOne({
      where: { chat_group: { id: groupId }, solver_user: { id: userId } },
    });

    const isSolver = !!assigned;
    const isAdmin = group.pqr.client_user.id === userId;

    if (!isSolver && !isAdmin) {
      throw new ForbiddenException(
        "Only admin or solver can change the group status"
      );
    }

    group.status = status;
    return this.chatRepo.save(group);
  }
  async getChatGroupsWithDetails(userId: string) {
    const user = await this.asgRepo.findOne({
      where: { solver_user: { id: userId } },
      relations: ["solver_user"],
    });
    const isAdmin = user?.solver_user?.role.name === "Admin";

    if (isAdmin) {
      return this.chatRepo.find({
        relations: [
          "pqr.client_user",
          "assignments",
          "assignments.solver_user",
        ],
      });
    }
    return this.chatRepo.find({
      where: { pqr: { client_user: { id: userId } } },
      relations: ["pqr.client_user", "assignments", "assignments.solver_user"],
    });
  }
}
