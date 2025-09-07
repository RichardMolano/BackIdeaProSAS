import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
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
import { UsersService } from "./users.service";
import { UserDto, CreateUserDto, UpdateUserDto } from "./dto/user.dto";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("users")
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Obtener usuario actual" })
  @ApiResponse({
    status: 200,
    description: "Usuario autenticado",
    type: UserDto,
  })
  me(@Req() req: any) {
    return req.user;
  }

  @Get()
  @ApiOperation({ summary: "Listar todos los usuarios" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuarios",
    type: [UserDto],
  })
  async findAll() {
    const users = await this.usersService.findAll();
    // Normaliza el campo role a string para el frontend
    return (users || []).map((u: any) => ({
      id: u.id,
      email: u.email ?? "",
      role: u.role?.name ?? "", // string para la UI
      roleId: u.role?.id ?? null,
      dependence: u.dependence ?? null,
      createdAt: u.createdAt ?? u.created_at,
      updatedAt: u.updatedAt ?? u.updated_at,
    }));
  }

  @Post()
  @ApiOperation({ summary: "Crear usuario" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: "Usuario creado", type: UserDto })
  async create(@Body() dto: CreateUserDto) {
    // Asegúrate de que el servicio acepte email, password y role como string
    return this.usersService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar usuario" })
  @ApiParam({ name: "id", type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: "Usuario actualizado",
    type: UserDto,
  })
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar usuario" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({ status: 200, description: "Usuario eliminado" })
  async remove(@Param("id") id: string) {
    return this.usersService.delete(id);
  }
}
