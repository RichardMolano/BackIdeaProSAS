import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assignment } from "entities/assignment.entity";
import { ChatGroup } from "entities/chat-group.entity";
import { Message } from "entities/message.entity";
import { PqrTicket } from "entities/pqr-ticket.entity";
import { User } from "entities/user.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatGroup) private chatRepo: Repository<ChatGroup>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(PqrTicket) private pqrRepo: Repository<PqrTicket>,
    @InjectRepository(Assignment) private asgRepo: Repository<Assignment>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  /** ===== Helpers de rol ===== */
  private async getRoleName(userId: string): Promise<string | null> {
    const u = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["role"],
    });
    return u?.role?.name ?? null; // "Admin" | "Solver" | "Client" | ...
  }
  private async isAdmin(userId: string) {
    return (await this.getRoleName(userId)) === "Admin";
  }
  private async isSolver(userId: string) {
    return (await this.getRoleName(userId)) === "Solver";
  }

  /** ===== Grupos ===== */
  // Regla: Admin -> todos; Solver -> asignados + propios; Cliente -> propios
  async listGroupsForUser(userId: string) {
    const role = await this.getRoleName(userId);

    if (role === "Admin") {
      return this.chatRepo.find();
    }

    if (role === "Solver") {
      return this.chatRepo.find({
        where: [
          { assignments: { solver_user: { id: userId } } }, // asignados a mí
          { pqr: { client_user: { id: userId } } }, // y los míos
        ],
      });
    }

    // Cliente: solo los propios
    return this.chatRepo.find({
      where: { pqr: { client_user: { id: userId } } },
    });
  }

  async listAllGroups() {
    return this.chatRepo.find();
  }

  /** ===== Mensajes ===== */
  async listMessages(userId: string, groupId: string) {
    await this.ensureAccess(userId, groupId);
    const messages = await this.msgRepo.find({
      where: { chat_group: { id: groupId } },
      order: { created_at: "ASC" },
      relations: ["user", "chat_group"], // Añadir chat_group
    });
    return messages.map((m) => ({
      ...m,
      sender_email: m.user?.email ?? null,
    }));
  }

  async listAllMessages(groupId: string) {
    const messages = await this.msgRepo.find({
      where: { chat_group: { id: groupId } },
      order: { created_at: "ASC" },
      relations: ["user", "chat_group"], // Añadir chat_group
    });
    return messages.map((m) => ({
      ...m,
      sender_email: m.user?.email ?? null,
    }));
  }

  async sendMessage(
    userId: string,
    groupId: string,
    content: string,
    file_url?: string,
    file_type?: string
  ) {
    console.log("sendMessage called with:", {
      userId,
      groupId,
      content,
      file_url,
      file_type,
    });
    await this.ensureAccess(userId, groupId);
    const isActive = await this.isChatActive(groupId);
    if (!isActive) throw new ForbiddenException("Chat is not active");

    // Verifica que el usuario exista
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("User not found");

    // Verifica que el grupo exista - y asegúrate que sea exactamente el recibido
    const group = await this.chatRepo.findOne({
      where: { id: groupId },
      // No cargar relaciones innecesarias que podrían alterar el ID
    });
    if (!group)
      throw new BadRequestException(`Chat group not found with ID ${groupId}`);

    // VERIFICACIÓN ADICIONAL: comprobar que los IDs coinciden
    if (group.id !== groupId) {
      throw new BadRequestException(
        `Group ID mismatch: expected ${groupId}, got ${group.id}`
      );
    }

    try {
      // Crear el mensaje explícitamente con el ID del grupo
      const entity = this.msgRepo.create({
        chat_group: { id: groupId }, // Usa directamente el ID recibido
        user: { id: userId },
        content,
        file_url: file_url ?? null,
        file_type: file_type ?? null,
      });

      const saved = await this.msgRepo.save(entity);

      // Recarga con relaciones, pero asegura que el ID del grupo sea correcto
      const withRelations = await this.msgRepo.findOne({
        where: { id: saved.id },
        relations: ["user", "chat_group"],
      });

      if (!withRelations) {
        throw new Error("Failed to reload message with relations");
      }

      // Verificación final del ID del grupo
      if (withRelations.chat_group?.id !== groupId) {
        console.error(
          `Group ID mismatch after save: expected ${groupId}, got ${withRelations.chat_group?.id}`
        );
        // Corrige manualmente el ID si es necesario
        withRelations.chat_group = { ...withRelations.chat_group, id: groupId };
      }

      return {
        ...withRelations,
        sender_email: user.email,
        // Garantizar el ID correcto del grupo
        chat_group: {
          ...withRelations.chat_group,
          id: groupId,
        },
        groupId: groupId, // Añadir el ID explícitamente
      };
    } catch (error) {
      console.error("Error saving message:", error);
      throw new BadRequestException(`Failed to save message: ${error.message}`);
    }
  }

  async isChatActive(groupId: string): Promise<boolean> {
    const group = await this.chatRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException("Chat group not found");
    return group.status === "OPEN" || group.status === "IN_PROGRESS";
  }

  /** ===== Acceso =====
   * Permite: dueño del PQR, solver asignado, o Admin
   */
  private async ensureAccess(userId: string, groupId: string) {
    const group = await this.chatRepo.findOne({
      where: { id: groupId },
      relations: ["pqr", "pqr.client_user"],
    });
    if (!group) throw new NotFoundException("Chat group not found");

    // dueño (cliente del PQR)
    if (group.pqr?.client_user?.id === userId) return;

    // solver asignado
    const assigned = await this.asgRepo.findOne({
      where: { chat_group: { id: groupId }, solver_user: { id: userId } },
    });
    if (assigned) return;

    // admin
    if (await this.isAdmin(userId)) return;

    throw new ForbiddenException("No access to this chat");
  }

  /** ===== Estado del grupo =====
   * Solo Admin o Solver asignado puede cambiarlo.
   * Si no cambia, no guardamos (evita UpdateValuesMissingError).
   */
  async setGroupStatus(
    userId: string,
    groupId: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) {
    if (!status) throw new BadRequestException("Status is required");

    const group = await this.chatRepo.findOne({
      where: { id: groupId },
      relations: ["pqr", "pqr.client_user"],
    });
    if (!group) throw new NotFoundException("Chat group not found");

    const assigned = await this.asgRepo.findOne({
      where: { chat_group: { id: groupId }, solver_user: { id: userId } },
    });
    const canAdmin = await this.isAdmin(userId);
    const canSolver = !!assigned;

    if (!canAdmin && !canSolver) {
      throw new ForbiddenException(
        "Only admin or solver can change the group status"
      );
    }

    if (group.status === status) {
      return group; // sin cambios -> no dispares UPDATE
    }

    group.status = status;
    return this.chatRepo.save(group);
  }

  /** ===== Vista con detalles, según regla de visibilidad ===== */
  async getChatGroupsWithDetails(userId: string) {
    const role = await this.getRoleName(userId);

    if (role === "Admin") {
      return this.chatRepo.find({
        relations: [
          "pqr.client_user",
          "assignments",
          "assignments.solver_user",
        ],
      });
    }

    if (role === "Solver") {
      return this.chatRepo.find({
        where: [
          { assignments: { solver_user: { id: userId } } }, // asignados a mí
          { pqr: { client_user: { id: userId } } }, // y los míos
        ],
        relations: [
          "pqr.client_user",
          "assignments",
          "assignments.solver_user",
        ],
      });
    }

    // Cliente
    return this.chatRepo.find({
      where: { pqr: { client_user: { id: userId } } },
      relations: ["pqr.client_user", "assignments", "assignments.solver_user"],
    });
  }
}
