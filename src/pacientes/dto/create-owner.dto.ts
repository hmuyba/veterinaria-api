import { IsOptional, IsString } from 'class-validator';

export class CreateOwnerDto {
  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  ci?: string;
}
