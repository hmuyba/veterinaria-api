import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet } from '../pacientes/entities/pet.entity';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { Treatment } from './entities/treatment.entity';
import { HistorialController } from './historial.controller';
import { HistorialService } from './historial.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicalRecord, Treatment, Pet, Owner])],
  controllers: [HistorialController],
  providers: [HistorialService, JwtAuthGuard, RolesGuard],
})
export class HistorialModule {}
