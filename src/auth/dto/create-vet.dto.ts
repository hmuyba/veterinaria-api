import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateVetDto {
  @ApiProperty({ example: 'dr.medina@clinica.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'vet123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Dr. Roberto Medina' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: '76543210' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ description: 'UUID de la clínica a la que pertenecerá el veterinario' })
  @IsUUID()
  clinic_id: string;
}
