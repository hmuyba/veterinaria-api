import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTreatmentDto {
  @ApiProperty({ example: 'Amoxicilina' })
  @IsString()
  medicamento: string;

  @ApiProperty({ example: '250mg cada 8 horas' })
  @IsString()
  dosis: string;

  @ApiPropertyOptional({ example: '7 días' })
  @IsOptional()
  @IsString()
  duracion?: string;

  @ApiPropertyOptional({ example: 'Administrar con alimento' })
  @IsOptional()
  @IsString()
  indicaciones?: string;
}
