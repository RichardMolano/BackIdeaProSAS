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

@UseGuards(AuthGuard("jwt"))
@Controller("assignments")
export class AssignmentsController {
  constructor(
    @Inject(AssignmentsService)
    private readonly assignmentsService: AssignmentsService
  ) {} // ⬅️ inyección robusta

  @Get("solvers")
  solvers() {
    return this.assignmentsService.listSolvers();
  }

  @Post("assign")
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
