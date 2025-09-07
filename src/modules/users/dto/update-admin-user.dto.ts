import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { AdminRole } from "./create-admin-user.dto";

export class UpdateAdminUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;

  // opcional: permitir asignar o quitar dependencia
  @IsOptional()
  @IsUUID()
  dependenceId?: string | null;
}
