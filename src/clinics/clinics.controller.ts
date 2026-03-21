import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@ApiTags('Clinics')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  /**
   * Pública: se usa en el frontend para el select de registro.
   */
  @Get()
  @ApiOperation({ summary: 'Listar todas las clínicas (público — para el registro)' })
  @ApiResponse({ status: 200, description: 'Lista de clínicas activas' })
  findAll() {
    return this.clinicsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una clínica por ID (público)' })
  @ApiResponse({ status: 200, description: 'Clínica encontrada' })
  @ApiResponse({ status: 404, description: 'Clínica no encontrada' })
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Crear clínica (solo SUPER_ADMIN)' })
  @ApiResponse({ status: 201, description: 'Clínica creada' })
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: 'Actualizar clínica (solo SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Clínica actualizada' })
  @ApiResponse({ status: 404, description: 'Clínica no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateClinicDto) {
    return this.clinicsService.update(id, dto);
  }
}
