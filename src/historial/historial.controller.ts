import {
  Body,
  Controller,
  Get,
  Param,
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
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { HistorialService } from './historial.service';

@ApiTags('Historial')
@ApiBearerAuth('access-token')
@Controller('clinical-records')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Crear consulta clínica con tratamientos (solo VETERINARIO)' })
  @ApiResponse({ status: 201, description: 'Consulta creada con tratamientos en cascada' })
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateClinicalRecordDto,
  ) {
    return this.historialService.create(user, dto);
  }

  @Get('pet/:petId')
  @ApiOperation({ summary: 'Listar consultas de una mascota (cronológico desc). PROPIETARIO solo las suyas.' })
  @ApiResponse({ status: 200, description: 'Lista de consultas con tratamientos' })
  findByPet(@Param('petId') petId: string, @CurrentUser() user: User) {
    return this.historialService.findByPet(petId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de una consulta clínica con sus tratamientos' })
  @ApiResponse({ status: 200, description: 'Consulta encontrada' })
  @ApiResponse({ status: 404, description: 'Consulta no encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.historialService.findOne(id, user);
  }
}
