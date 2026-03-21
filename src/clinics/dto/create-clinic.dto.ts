import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateClinicDto {
  @ApiProperty({ example: 'Clínica Veterinaria San Martín' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Av. Arce 1234, La Paz' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: '22123456' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
