import { IsString, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  chat_group_id!: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  file_url?: string;

  @IsOptional()
  @IsString()
  file_type?: string;
}
