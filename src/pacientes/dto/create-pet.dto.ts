import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Especie, Sexo } from '../entities/pet.entity';

export class CreatePetDto {
  @ApiProperty({ description: 'UUID del propietario (Owner)', example: 'uuid-del-owner' })
  @IsUUID()
  owner_id: string;

  @ApiProperty({ example: 'Fido' })
  @IsString()
  nombre: string;

  @ApiProperty({ enum: Especie, example: Especie.CANINO })
  @IsEnum(Especie)
  especie: Especie;

  @ApiPropertyOptional({ example: 'Labrador Retriever' })
  @IsOptional()
  @IsString()
  raza?: string;

  @ApiProperty({ enum: Sexo, example: Sexo.MACHO })
  @IsEnum(Sexo)
  sexo: Sexo;

  @ApiPropertyOptional({ example: '2021-05-10', description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fecha_nac?: string;

  @ApiPropertyOptional({ example: 25.5, description: 'Peso en kilogramos' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number;
}
