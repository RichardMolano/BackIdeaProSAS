import { describe, it, expect, beforeEach, mock } from "bun:test";
import { UsersService } from "./users.service";

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

// Mocks de repositorios
const mockUserRepo = {
  save: mock((u) => Promise.resolve({ ...u, id: "user-mock-id" })),
  create: mock((data) => ({ ...data })),
  find: mock(() => Promise.resolve([])),
  findOne: mock(() => Promise.resolve(null)),
  remove: mock((u) => Promise.resolve(u)),
  update: mock(() => Promise.resolve({ affected: 1 })),
};

const mockRoleRepo = {
  findOne: mock(() => Promise.resolve<{ name: string } | null>(null)),
};

const mockDependenceRepo = {
  findOne: mock(() => Promise.resolve(null)),
};

let service: UsersService;

beforeEach(() => {
  // Reiniciar los mocks
  mockUserRepo.save.mockReset();
  mockUserRepo.create.mockReset();
  mockUserRepo.find.mockReset();
  mockUserRepo.findOne.mockReset();
  mockUserRepo.remove.mockReset();
  mockUserRepo.update.mockReset();
  mockRoleRepo.findOne.mockReset();
  mockDependenceRepo.findOne.mockReset();

  // Configurar implementaciones por defecto después del reset
  mockUserRepo.create.mockImplementation((data) => ({ ...data }));
  mockUserRepo.save.mockImplementation((u) =>
    Promise.resolve({ ...u, id: "user-mock-id" })
  );

  service = new UsersService(
    mockUserRepo as any,
    mockRoleRepo as any,
    mockDependenceRepo as any
  );
});

describe("UsersService (Bun) - Crear Usuario", () => {
  it("✅ debería crear un usuario con rol existente", async () => {
    mockRoleRepo.findOne.mockResolvedValueOnce({ name: "Admin" });

    const dto = {
      email: "test@correo.com",
      password: "123456",
      role: "Admin",
    };

    const result = await service.create(dto);

    expect(result.id).toBe("user-mock-id");
    expect(result.email).toBe(dto.email);
    expect(mockUserRepo.save).toHaveBeenCalled();
  });
});
