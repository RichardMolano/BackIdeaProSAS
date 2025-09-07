import { IsString, IsOptional, IsIn } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePqrDto {
  @ApiProperty({ example: "Problema con el servicio" })
  @IsString()
  title!: string;

  @ApiProperty({ example: "Descripción detallada del problema" })
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: "MEDIUM", enum: ["LOW", "MEDIUM", "HIGH"] })
  @IsOptional()
  @IsIn(["LOW", "MEDIUM", "HIGH"])
  priority?: "LOW" | "MEDIUM" | "HIGH";

  @ApiPropertyOptional({ example: "2024-06-01T12:00:00Z" })
  @IsOptional()
  created_at?: Date;
}
