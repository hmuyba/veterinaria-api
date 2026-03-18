import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Owner } from './entities/owner.entity';
import { Pet } from './entities/pet.entity';
import { OwnersController } from './owners.controller';
import { OwnersService } from './owners.service';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Pet])],
  controllers: [OwnersController, PetsController],
  providers: [OwnersService, PetsService, JwtAuthGuard, RolesGuard],
})
export class PacientesModule {}
