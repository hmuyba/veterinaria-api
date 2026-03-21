import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateTreatmentDto } from './create-treatment.dto';

export class CreateClinicalRecordDto {
  @ApiProperty({ description: 'UUID de la mascota', example: 'uuid-de-la-mascota' })
  @IsUUID()
  pet_id: string;

  @ApiProperty({ example: 'Revisión anual y vacunación' })
  @IsString()
  motivo: string;

  @ApiProperty({ example: 'Paciente en buen estado. Sin hallazgos patológicos.' })
  @IsString()
  diagnostico: string;

  @ApiPropertyOptional({ example: 'Se recomienda dieta balanceada' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ example: '2026-03-20T14:30:00.000Z', description: 'Fecha de la consulta. Si no se envía, se usa la fecha actual.' })
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional({ type: [CreateTreatmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreatmentDto)
  treatments?: CreateTreatmentDto[];
}
