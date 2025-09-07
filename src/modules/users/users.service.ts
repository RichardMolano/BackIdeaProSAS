import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Role } from "../../entities/role.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import * as bcrypt from "bcryptjs"; // Asegúrate de tener bcryptjs instalado

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>
  ) {}

  async findAll() {
    return this.usersRepo.find({ relations: ["role", "dependence"] });
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["role", "dependence"],
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async create(dto: CreateUserDto) {
    let roleObj = undefined;
    if (dto.role) {
      roleObj = await this.rolesRepo.findOne({ where: { name: dto.role } });
      if (!roleObj) throw new BadRequestException("Role not found");
    }
    // Hashea la contraseña antes de guardar
    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;
    const user = this.usersRepo.create({
      ...dto,
      password_hash: passwordHash,
      role: roleObj ? roleObj : undefined,
    });
    // Elimina el campo password plano antes de guardar
    delete (user as any).password;
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");

    if (dto.role === "") delete dto.role;
    if (dto.dependence === "") delete dto.dependence;

    let roleObj = undefined;
    if (dto.role) {
      roleObj = await this.rolesRepo.findOne({ where: { name: dto.role } });
      if (!roleObj) throw new BadRequestException("Role not found");
      dto.role = roleObj;
    }

    // Si se envía nueva contraseña, hashearla
    if (dto.password) {
      (user as any).password_hash = await bcrypt.hash(dto.password, 10);
      delete (dto as any).password;
    }

    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async delete(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    await this.usersRepo.remove(user);
    return { deleted: true };
  }
}
