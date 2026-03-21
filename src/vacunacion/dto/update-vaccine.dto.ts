import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateVaccineDto {
  @ApiPropertyOptional({ example: 'Antirrábica refuerzo' })
  @IsOptional()
  @IsString()
  tipo_vacuna?: string;

  @ApiPropertyOptional({ example: '2026-03-18' })
  @IsOptional()
  @IsDateString()
  fecha_aplicacion?: string;

  @ApiPropertyOptional({ example: '2027-03-18' })
  @IsOptional()
  @IsDateString()
  fecha_proxima?: string;

  @ApiPropertyOptional({ example: true, description: 'Marcar como notificado al propietario' })
  @IsOptional()
  @IsBoolean()
  notificado?: boolean;
}
