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
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

@ApiTags('Pets')
@ApiBearerAuth('access-token')
@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Crear mascota vinculada a un propietario (solo VETERINARIO)' })
  @ApiResponse({ status: 201, description: 'Mascota creada' })
  create(@Body() dto: CreatePetDto) {
    return this.petsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mascotas. VETERINARIO ve todas; PROPIETARIO solo las suyas.' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas' })
  findAll(@CurrentUser() user: User) {
    return this.petsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mascota con datos del propietario' })
  @ApiResponse({ status: 200, description: 'Mascota encontrada' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.petsService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Actualizar datos de una mascota (solo VETERINARIO)' })
  @ApiResponse({ status: 200, description: 'Mascota actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(id, dto);
  }
}
