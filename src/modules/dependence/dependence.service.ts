import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dependence } from "../../entities/dependence.entity";
import { Repository } from "typeorm";
import { CreateDependenceDto, UpdateDependenceDto } from "./dto/dependence.dto";

@Injectable()
export class DependenceService {
  constructor(
    @InjectRepository(Dependence) private dependenceRepo: Repository<Dependence>
  ) {}

  async findAll() {
    return this.dependenceRepo.find();
  }

  async findOne(id: string) {
    const dep = await this.dependenceRepo.findOne({ where: { id } });
    if (!dep) throw new NotFoundException("Dependence not found");
    return dep;
  }

  async create(dto: CreateDependenceDto) {
    const dep = this.dependenceRepo.create(dto);
    return this.dependenceRepo.save(dep);
  }

  async update(id: string, dto: UpdateDependenceDto) {
    const dep = await this.dependenceRepo.findOne({ where: { id } });
    if (!dep) throw new NotFoundException("Dependence not found");
    Object.assign(dep, dto);
    return this.dependenceRepo.save(dep);
  }

  async delete(id: string) {
    const dep = await this.dependenceRepo.findOne({ where: { id } });
    if (!dep) throw new NotFoundException("Dependence not found");
    await this.dependenceRepo.remove(dep);
    return { deleted: true };
  }
}
