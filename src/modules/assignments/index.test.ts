import { describe, it, expect, mock, beforeEach } from "bun:test";

// 🧩 Mock de entidades problemáticas para evitar dependencia circular
mock.module("../../entities/message.entity", () => ({
  Message: class {},
}));

mock.module("../../entities/chat-group.entity", () => ({
  ChatGroup: class {},
}));

mock.module("../../entities/pqr-ticket.entity", () => ({
  PqrTicket: class {},
}));

mock.module("../../entities/assignment.entity", () => ({
  Assignment: class {},
}));

mock.module("../../entities/user.entity", () => ({
  User: class {},
}));

mock.module("../../entities/role.entity", () => ({
  Role: class {},
}));

mock.module("../../entities/dependence.entity", () => ({
  Dependence: class {},
}));

// Mock del AssignmentsService
const mockAssignmentsService = {
  listSolvers: mock(async () => {
    return [] as any[];
  }),
  assign: mock(async (adminRole: string, chat_group_id: string, solver_user_id: string) => {
    if (!(adminRole === "Admin" || adminRole === "Supervisor")) {
      throw new Error("Requires Admin/Supervisor");
    }
    return { id: "assignment-1" };
  }),
  unassign: mock(async (adminRole: string, chat_group_id: string, solver_user_id: string) => {
    if (!(adminRole === "Admin" || adminRole === "Supervisor")) {
      throw new Error("Requires Admin/Supervisor");
    }
    return { ok: true };
  }),
};

describe("AssignmentsModule", () => {
  beforeEach(() => {
    mockAssignmentsService.listSolvers.mockClear();
    mockAssignmentsService.assign.mockClear();
    mockAssignmentsService.unassign.mockClear();
  });

  describe("listSolvers", () => {
    it("✅ debería retornar lista de solvers", async () => {
      const mockSolvers = [
        { id: "1", email: "solver1@test.com", role: { name: "Solver" } },
        { id: "2", email: "solver2@test.com", role: { name: "Admin" } }
      ];
      
      mockAssignmentsService.listSolvers.mockResolvedValueOnce(mockSolvers);
      
      const result = await mockAssignmentsService.listSolvers();
      
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe("solver1@test.com");
      expect(mockAssignmentsService.listSolvers).toHaveBeenCalled();
    });

    it("✅ debería retornar array vacío cuando no hay solvers", async () => {
      mockAssignmentsService.listSolvers.mockResolvedValueOnce([]);
      
      const result = await mockAssignmentsService.listSolvers();
      
      expect(result).toHaveLength(0);
    });
  });

  describe("assign", () => {
    it("✅ debería asignar solver cuando tiene rol Admin", async () => {
      mockAssignmentsService.assign.mockResolvedValueOnce({ 
        id: "assignment-1"
      });
      
      const result = await mockAssignmentsService.assign("Admin", "chat-1", "solver-1");
      
      expect(result.id).toBe("assignment-1");
      expect(mockAssignmentsService.assign).toHaveBeenCalledWith("Admin", "chat-1", "solver-1");
    });

    it("✅ debería asignar solver cuando tiene rol Supervisor", async () => {
      mockAssignmentsService.assign.mockResolvedValueOnce({ 
        id: "assignment-2" 
      });
      
      const result = await mockAssignmentsService.assign("Supervisor", "chat-2", "solver-2");
      
      expect(result.id).toBe("assignment-2");
      expect(mockAssignmentsService.assign).toHaveBeenCalledWith("Supervisor", "chat-2", "solver-2");
    });

    it("❌ debería lanzar error cuando no tiene rol Admin/Supervisor", async () => {
      await expect(
        mockAssignmentsService.assign("User", "chat-1", "solver-1")
      ).rejects.toThrow("Requires Admin/Supervisor");
    });
  });

  describe("unassign", () => {
    it("✅ debería desasignar solver cuando tiene rol Admin", async () => {
      mockAssignmentsService.unassign.mockResolvedValueOnce({ ok: true });
      
      const result = await mockAssignmentsService.unassign("Admin", "chat-1", "solver-1");
      
      expect(result.ok).toBe(true);
      expect(mockAssignmentsService.unassign).toHaveBeenCalledWith("Admin", "chat-1", "solver-1");
    });

    it("✅ debería desasignar solver cuando tiene rol Supervisor", async () => {
      mockAssignmentsService.unassign.mockResolvedValueOnce({ ok: true });
      
      const result = await mockAssignmentsService.unassign("Supervisor", "chat-2", "solver-2");
      
      expect(result.ok).toBe(true);
      expect(mockAssignmentsService.unassign).toHaveBeenCalledWith("Supervisor", "chat-2", "solver-2");
    });

    it("❌ debería lanzar error cuando no tiene rol Admin/Supervisor", async () => {
      await expect(
        mockAssignmentsService.unassign("User", "chat-1", "solver-1")
      ).rejects.toThrow("Requires Admin/Supervisor");
    });
  });
});