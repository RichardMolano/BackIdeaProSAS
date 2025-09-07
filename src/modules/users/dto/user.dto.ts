import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from "class-validator";

export class UserDto {
  @ApiProperty({ example: "uuid-user" })
  @IsString()
  id!: string;

  @ApiProperty({ example: "juan@example.com" })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: "admin" })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: "uuid-role" })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiPropertyOptional({ example: "dependencia" })
  @IsOptional()
  dependence?: any;

  @ApiPropertyOptional({ example: "2024-06-01T12:00:00Z" })
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ example: "2024-06-01T12:00:00Z" })
  @IsOptional()
  updatedAt?: Date;
}

export class CreateUserDto {
  @ApiProperty({ example: "juan@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ example: "admin" })
  @IsOptional()
  @IsString()
  role?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "nuevo@email.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "admin" })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: "nuevaPassword123" })
  @IsOptional()
  @IsString()
  password?: string;
}
