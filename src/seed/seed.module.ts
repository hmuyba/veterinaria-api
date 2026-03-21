import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Role } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet } from '../pacientes/entities/pet.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, Role, User, Owner, Pet])],
  providers: [SeedService],
})
export class SeedModule {}
