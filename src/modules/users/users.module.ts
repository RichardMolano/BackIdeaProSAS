import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Role } from "../../entities/role.entity";
import { Dependence } from "../../entities/dependence.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Dependence])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
