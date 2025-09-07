import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  UseGuards,
  Inject,
  Patch,
  Param,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";
import { SendMessageDto } from "./dto/send-message.dto";
import { Roles } from "modules/auth/roles.decorator";
import { UUID } from "crypto";

@UseGuards(AuthGuard("jwt"))
@Controller("chat")
export class ChatController {
  constructor(@Inject(ChatService) private readonly chatService: ChatService) {} // ⬅️ inyección robusta

  @Get("groups")
  groups(@Req() req: any) {
    if (req.user.role === "Admin") {
      console.log("Admin user detected");
      return this.chatService.listAllGroups();
    }
    return this.chatService.listGroupsForUser(req.user.userId);
  }

  @Get("messages")
  messages(@Req() req: any, @Query("groupId") groupId: string) {
    if (req.user.role === "Admin") {
      console.log("Admin user detected");
      return this.chatService.listAllMessages(groupId);
    }
    return this.chatService.listMessages(req.user.userId, groupId);
  }

  @Post("message")
  send(@Req() req: any, @Body() dto: SendMessageDto) {
    console.log("Message DTO:", dto);
    return this.chatService.sendMessage(
      req.user.userId,
      dto.groupId,
      dto.content,
      dto.file_url,
      dto.file_type
    );
  }

  @Post("set-group-status")
  setGroupStatus(
    @Req() req: any,
    @Body("chat_group_id") chatGroupId: string,
    @Body("status") status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  ) {
    return this.chatService.setGroupStatus(
      req.user.userId,
      chatGroupId,
      status
    );
  }

  @Get("groups-with-details")
  getChatGroupsWithDetails(@Req() req: any) {
    console.log("User ID: %s", req.user.userId);
    console.log("User Role: %s", req.user.role);
    return this.chatService.getChatGroupsWithDetails(req.user.userId);
  }
}
