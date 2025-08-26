import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { ChatGroup } from "../../entities/chat-group.entity";
import { Message } from "../../entities/message.entity";
import { PqrTicket } from "../../entities/pqr-ticket.entity";
import { Assignment } from "../../entities/assignment.entity";
import { User } from "entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatGroup, Message, PqrTicket, Assignment, User]),
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
