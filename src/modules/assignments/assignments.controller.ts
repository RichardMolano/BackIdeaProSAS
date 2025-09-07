import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AssignmentsService } from "./assignments.service";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Assignments")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("assignments")
export class AssignmentsController {
  constructor(
    @Inject(AssignmentsService)
    private readonly assignmentsService: AssignmentsService
  ) {}

  @Get("solvers")
  @ApiOperation({ summary: "Listar solvers disponibles" })
  @ApiResponse({ status: 200, description: "Lista de solvers" })
  solvers() {
    return this.assignmentsService.listSolvers();
  }

  @Post("assign")
  @ApiOperation({ summary: "Asignar solver a chat group" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        chat_group_id: { type: "string", example: "uuid-chat-group" },
        solver_user_id: { type: "string", example: "uuid-solver-user" },
      },
      required: ["chat_group_id", "solver_user_id"],
    },
  })
  @ApiResponse({ status: 201, description: "Asignación realizada" })
  assign(
    @Req() req: any,
    @Body() body: { chat_group_id: string; solver_user_id: string }
  ) {
    return this.assignmentsService.assign(
      req.user?.role,
      body.chat_group_id,
      body.solver_user_id
    );
  }

  @Post("unassign/:chat_group_id/:solver_user_id")
  @ApiOperation({ summary: "Desasignar solver de chat group" })
  @ApiParam({ name: "chat_group_id", type: String })
  @ApiParam({ name: "solver_user_id", type: String })
  @ApiResponse({ status: 200, description: "Desasignación realizada" })
  unassign(
    @Req() req: any,
    @Param("chat_group_id") chat_group_id: string,
    @Param("solver_user_id") solver_user_id: string
  ) {
    return this.assignmentsService.unassign(
      req.user?.role,
      chat_group_id,
      solver_user_id
    );
  }
}
