import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Assignment } from "../../entities/assignment.entity";
import { ChatGroup } from "../../entities/chat-group.entity";
import { PqrTicket } from "../../entities/pqr-ticket.entity";
import { User } from "../../entities/user.entity";
import { AssignmentsController } from "./assignments.controller";
import { AssignmentsService } from "./assignments.service";
import { AssignmentsGateway } from "./assignments.gateway";
import { Role } from "entities/role.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, ChatGroup, User, Role, PqrTicket]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsGateway],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
