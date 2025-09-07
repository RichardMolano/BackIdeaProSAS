import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Role } from "../../entities/role.entity";
import { Dependence } from "../../entities/dependence.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Dependence) private dependenceRepo: Repository<Dependence>
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

  async create(dto: CreateUserDto & { dependenceId?: string }) {
    let roleObj = undefined;
    if (dto.role) {
      roleObj = await this.rolesRepo.findOne({ where: { name: dto.role } });
      if (!roleObj) throw new BadRequestException("Role not found");
    }

    let dependenceObj = undefined;
    if (dto.role === "Solver" && dto.dependenceId) {
      dependenceObj = await this.dependenceRepo.findOne({
        where: { id: dto.dependenceId },
      });
      if (!dependenceObj) throw new BadRequestException("Dependence not found");
    }

    // Si el rol no es Solver, no asignar dependencia
    if (dto.role !== "Solver") {
      dependenceObj = undefined;
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : undefined;

    const user = this.usersRepo.create({
      ...dto,
      password_hash: passwordHash,
      role: roleObj ? roleObj : undefined,
      dependence: dependenceObj ? dependenceObj : undefined,
    });
    delete (user as any).password;
    delete (user as any).dependenceId;
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto & { dependenceId?: string }) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ["role", "dependence"],
    });
    if (!user) throw new NotFoundException("User not found");

    if (dto.role === "") delete dto.role;
    if (dto.dependenceId === "") delete dto.dependenceId;

    let roleObj = undefined;
    if (dto.role) {
      roleObj = await this.rolesRepo.findOne({ where: { name: dto.role } });
      if (!roleObj) throw new BadRequestException("Role not found");
      dto.role = roleObj;
    }

    let removeDependence = false;

    // Si el rol cambia y NO es Solver, quitar dependencia SIEMPRE
    if (dto.role && dto.role.name !== "Solver") {
      user.dependence = null;
      removeDependence = true;
    }
    // Si el rol es Solver y se envía dependenceId, asignar dependencia
    else if (dto.role && dto.role.name === "Solver" && dto.dependenceId) {
      const dependenceObj = await this.dependenceRepo.findOne({
        where: { id: dto.dependenceId },
      });
      if (!dependenceObj) throw new BadRequestException("Dependence not found");
      user.dependence = dependenceObj;
    }
    // Si no se cambia el rol, pero el usuario ya no es Solver, quitar dependencia
    else if (!dto.role && user.role?.name !== "Solver") {
      user.dependence = null;
      removeDependence = true;
    }
    // Si no se cambia el rol y el usuario sigue siendo Solver y se envía dependenceId, asignar dependencia
    else if (!dto.role && user.role?.name === "Solver" && dto.dependenceId) {
      const dependenceObj = await this.dependenceRepo.findOne({
        where: { id: dto.dependenceId },
      });
      if (!dependenceObj) throw new BadRequestException("Dependence not found");
      user.dependence = dependenceObj;
    }

    // Si se envía nueva contraseña, hashearla
    if (dto.password) {
      (user as any).password_hash = await bcrypt.hash(dto.password, 10);
      delete (dto as any).password;
    }

    Object.assign(user, dto);
    delete (user as any).dependenceId;

    // Solo llamar a update si realmente quieres borrar la dependencia
    if (removeDependence) {
      await this.usersRepo.update(id, { dependence: null });
    }

    return this.usersRepo.save(user);
  }

  async delete(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    await this.usersRepo.remove(user);
    return { deleted: true };
  }
}
