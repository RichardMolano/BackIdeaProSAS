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
import { PqrService } from "./pqr.service";
import { CreatePqrDto } from "./dto/create-pqr.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("pqr")
export class PqrController {
  constructor(@Inject(PqrService) private readonly pqrService: PqrService) {} // ⬅️ inyección robusta

  @Post()
  create(@Req() req: any, @Body() dto: CreatePqrDto) {
    const uid = req.user.userId;
    return this.pqrService.createPqr(
      uid,
      dto.title,
      dto.description,
      dto.priority || "MEDIUM",
      dto.dependence ? dto.dependence : null
    );
  }

  @Get("mine")
  mine(@Req() req: any) {
    const uid = req.user.userId;
    return this.pqrService.mine(uid);
  }

  @Get(":id")
  getOne(@Req() req: any, @Param("id") id: string) {
    const uid = req.user.userId;
    return this.pqrService.getById(uid, id);
  }
}
