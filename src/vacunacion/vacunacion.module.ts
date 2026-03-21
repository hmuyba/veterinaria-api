import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet } from '../pacientes/entities/pet.entity';
import { Vaccine } from './entities/vaccine.entity';
import { VacunacionController } from './vacunacion.controller';
import { VacunacionService } from './vacunacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccine, Pet, Owner])],
  controllers: [VacunacionController],
  providers: [VacunacionService, JwtAuthGuard, RolesGuard],
})
export class VacunacionModule {}
