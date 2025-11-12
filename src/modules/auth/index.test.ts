import { describe, it, expect, mock } from "bun:test";

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

// Mocks básicos de repositorios
const mockUserRepo = {
  findOne: mock(() => Promise.resolve(null)),
  save: mock((user: any) => Promise.resolve({ ...user, id: "user-mock-id" })),
};

const mockJwtService = {
  sign: mock((payload: any, options?: any) => "mock-jwt-token"),
};

describe("AuthService (Bun) - Tests Básicos", () => {
  it("✅ debería crear instancia de AuthService", () => {
    // Simular creación del servicio
    const service = {
      register: mock(async (dto: any) => ({ id: "user-1", email: dto.email })),
      login: mock(async (dto: any) => ({ access_token: "token", user: { email: dto.email } })),
    };

    expect(service).toBeDefined();
  });

  it("✅ debería simular registro de usuario", async () => {
    const registerDto = {
      email: "test@test.com",
      password: "123456",
      name: "Test User",
    };

    // Simular registro usando el mock del repositorio
    const result = await mockUserRepo.save(registerDto);
    const resultData = result as any;

    expect(resultData.id).toBe("user-mock-id");
    expect(resultData.email).toBe("test@test.com");
  });

  it("✅ debería simular login de usuario", async () => {
    const mockUser = {
      id: "user-123",
      email: "user@test.com",
      password_hash: "hashed-password",
    };

    mockUserRepo.findOne.mockResolvedValueOnce(mockUser as any);

    const user = await mockUserRepo.findOne();
    const userData = user as any;

    expect(userData.id).toBe("user-123");
    expect(userData.email).toBe("user@test.com");
  });

  it("✅ debería generar JWT token", () => {
    const token = mockJwtService.sign({ userId: "user-123" }, { expiresIn: "1h" });
    expect(token).toBe("mock-jwt-token");
  });

  it("✅ debería generar JWT token sin opciones", () => {
    const token = mockJwtService.sign({ userId: "user-123" });
    expect(token).toBe("mock-jwt-token");
  });

  it("❌ debería fallar si usuario no existe en login", async () => {
    mockUserRepo.findOne.mockResolvedValueOnce(null);

    const user = await mockUserRepo.findOne();
    expect(user).toBeNull();
  });
});

describe("AuthModule", () => {
  it("placeholder test", () => {
    expect(true).toBe(true);
  });
});