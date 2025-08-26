import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

// ⚠️ Usa bcryptjs en modo *sync*
import { hashSync, compareSync } from "bcryptjs";

import { User } from "../../entities/user.entity";
import { Role } from "../../entities/role.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    @Inject(JwtService) private readonly jwt: JwtService // ⬅️ inyección explícita
  ) {}

  async register(email: string, password: string, roleName?: string) {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) throw new BadRequestException("Email already in use");

    let role = await this.rolesRepo.findOne({
      where: { name: (roleName as any) || "Client" },
    });
    if (!role) {
      role = this.rolesRepo.create({ name: "Client" as any });
      await this.rolesRepo.save(role);
    }

    const password_hash = hashSync(password, 10); // ✅ sync
    const user = this.usersRepo.create({ email, password_hash, role });
    await this.usersRepo.save(user);
    return this.makeToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const ok = compareSync(password, user.password_hash); // ✅ sync
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    return this.makeToken(user);
  }

  private makeToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || "Client",
    };
    const access_token = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET || "please_change_me",
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });
    return {
      access_token,
      user: { id: user.id, email: user.email, role: user.role?.name },
    };
  }
}
