import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOwnerDto {
  @ApiPropertyOptional({ example: 'Av. América 456, La Paz' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: '7654321' })
  @IsOptional()
  @IsString()
  ci?: string;
}
