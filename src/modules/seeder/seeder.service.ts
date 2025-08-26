import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import { Role } from "../../entities/role.entity";
import { User } from "../../entities/user.entity";

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(User) private usersRepo: Repository<User>
  ) {}

  async onModuleInit() {
    const roles = ["Admin", "Client", "Solver", "Supervisor"] as const;
    for (const name of roles) {
      const exists = await this.rolesRepo.findOne({
        where: { name: name as any },
      });
      if (!exists) {
        await this.rolesRepo.save(this.rolesRepo.create({ name: name as any }));
      }
    }
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const email = process.env.ADMIN_EMAIL;
      const found = await this.usersRepo.findOne({ where: { email } });
      if (!found) {
        const adminRole = await this.rolesRepo.findOne({
          where: { name: "Admin" as any },
        });
        const password_hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10);
        await this.usersRepo.save(
          this.usersRepo.create({ email, password_hash, role: adminRole! })
        );
        // eslint-disable-next-line no-console
        console.log("[SEED] Admin user created:", email);
      }
    }
  }
}
