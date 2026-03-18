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
  @IsUUID()
  owner_id: string;

  @IsString()
  nombre: string;

  @IsEnum(Especie)
  especie: Especie;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsEnum(Sexo)
  sexo: Sexo;

  @IsOptional()
  @IsDateString()
  fecha_nac?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number;
}
