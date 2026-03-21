import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { VacunacionService } from './vacunacion.service';

@ApiTags('Vacunación')
@ApiBearerAuth('access-token')
@Controller('vaccines')
@UseGuards(JwtAuthGuard)
export class VacunacionController {
  constructor(private readonly vacunacionService: VacunacionService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Registrar vacuna aplicada a una mascota (solo VETERINARIO)' })
  @ApiResponse({ status: 201, description: 'Vacuna registrada' })
  create(@CurrentUser() user: User, @Body() dto: CreateVaccineDto) {
    return this.vacunacionService.create(user, dto);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Vacunas próximas a vencer (≤7 días, sin notificar) — solo VETERINARIO' })
  @ApiResponse({ status: 200, description: 'Lista ordenada por fecha_proxima ASC' })
  findPending(@CurrentUser() user: User) {
    return this.vacunacionService.findPending(user);
  }

  @Get('pet/:petId')
  @ApiOperation({ summary: 'Historial de vacunas de una mascota. PROPIETARIO solo las suyas.' })
  @ApiResponse({ status: 200, description: 'Lista cronológica de vacunas' })
  findByPet(@Param('petId') petId: string, @CurrentUser() user: User) {
    return this.vacunacionService.findByPet(petId, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Actualizar vacuna (notificado, fecha_proxima, etc.) — solo VETERINARIO' })
  @ApiResponse({ status: 200, description: 'Vacuna actualizada' })
  @ApiResponse({ status: 404, description: 'Vacuna no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateVaccineDto) {
    return this.vacunacionService.update(id, dto);
  }
}
