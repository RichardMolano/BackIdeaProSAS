import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import {
  DependenceDto,
  CreateDependenceDto,
  UpdateDependenceDto,
} from "./dto/dependence.dto";
import { DependenceService } from "./dependence.service";

@ApiTags("Dependence")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("dependence")
export class DependenceController {
  constructor(
    @Inject(DependenceService)
    private readonly dependenceService: DependenceService
  ) {}

  @Get()
  @ApiOperation({ summary: "Listar todas las dependencias" })
  @ApiResponse({
    status: 200,
    description: "Lista de dependencias",
    type: [DependenceDto],
  })
  findAll() {
    return this.dependenceService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener dependencia por ID" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 200,
    description: "Dependencia encontrada",
    type: DependenceDto,
  })
  findOne(@Param("id") id: string) {
    return this.dependenceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear dependencia" })
  @ApiBody({ type: CreateDependenceDto })
  @ApiResponse({
    status: 201,
    description: "Dependencia creada",
    type: DependenceDto,
  })
  create(@Body() dto: CreateDependenceDto) {
    return this.dependenceService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar dependencia" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateDependenceDto })
  @ApiResponse({
    status: 200,
    description: "Dependencia actualizada",
    type: DependenceDto,
  })
  update(@Param("id") id: string, @Body() dto: UpdateDependenceDto) {
    return this.dependenceService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar dependencia" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Dependencia eliminada" })
  remove(@Param("id") id: string) {
    return this.dependenceService.delete(id);
  }
}
