import { IsOptional, IsString } from 'class-validator';

export class CreateTreatmentDto {
  @IsString()
  medicamento: string;

  @IsString()
  dosis: string;

  @IsOptional()
  @IsString()
  duracion?: string;

  @IsOptional()
  @IsString()
  indicaciones?: string;
}
