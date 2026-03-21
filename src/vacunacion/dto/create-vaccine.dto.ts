import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateVaccineDto {
  @ApiProperty({ description: 'UUID de la mascota', example: 'uuid-de-la-mascota' })
  @IsUUID()
  pet_id: string;

  @ApiProperty({ example: 'Antirrábica' })
  @IsString()
  tipo_vacuna: string;

  @ApiProperty({ example: '2026-03-18', description: 'Fecha de aplicación (YYYY-MM-DD)' })
  @IsDateString()
  fecha_aplicacion: string;

  @ApiPropertyOptional({ example: '2027-03-18', description: 'Fecha del próximo refuerzo (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_proxima?: string;
}
