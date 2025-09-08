import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGroup } from "../../entities/chat-group.entity";
import { PqrTicket } from "../../entities/pqr-ticket.entity";
import { User } from "../../entities/user.entity";
import { Dependence } from "../../entities/dependence.entity";
import { PqrService } from "./pqr.service";
import { PqrController } from "./pqr.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PqrTicket, User, ChatGroup, Dependence])],
  providers: [PqrService],
  controllers: [PqrController],
  exports: [PqrService],
})
export class PqrModule {}
