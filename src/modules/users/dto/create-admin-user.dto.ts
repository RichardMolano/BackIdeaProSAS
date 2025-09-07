import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export enum AdminRole {
  ADMIN = "ADMIN",
  SOLVER = "SOLVER",
  GENERAL = "GENERAL",
  SYSTEMS = "SYSTEMS",
  FINANCES = "FINANCES",
  MANAGEMENT = "MANAGEMENT",
  REQUESTS = "REQUESTS",
  QUESTIONS = "QUESTIONS",
}

export class CreateAdminUserDto {
  @IsString()
  @MinLength(2)
  name!: string; // mapea a fullName en la entidad

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(AdminRole)
  role!: AdminRole;

  // opcional: solo válido si role === SOLVER
  @IsOptional()
  @IsUUID()
  dependenceId?: string;
}
