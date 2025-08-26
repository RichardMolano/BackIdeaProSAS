import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeederService } from "./seeder.service";
import { Role } from "../../entities/role.entity";
import { User } from "../../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [SeederService],
})
export class SeederModule {}
