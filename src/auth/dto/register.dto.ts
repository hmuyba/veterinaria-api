import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string;

  @ApiProperty({ example: 'secreto123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: '71234567' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'UUID de la clínica donde se registra el propietario' })
  @IsOptional()
  @IsUUID()
  clinic_id?: string;
}
