import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateTreatmentDto } from './create-treatment.dto';

export class CreateClinicalRecordDto {
  @IsUUID()
  pet_id: string;

  @IsString()
  motivo: string;

  @IsString()
  diagnostico: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentDto)
  treatments?: CreateTreatmentDto[];
}
