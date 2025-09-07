import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class DependenceDto {
  @ApiProperty({ example: "uuid-dependence" })
  id!: string;

  @ApiProperty({ example: "Recursos Humanos" })
  name!: string;
}

export class CreateDependenceDto {
  @ApiProperty({ example: "Recursos Humanos" })
  @IsString()
  name!: string;
}

export class UpdateDependenceDto {
  @ApiPropertyOptional({ example: "Recursos Humanos" })
  @IsOptional()
  @IsString()
  name?: string;
}
