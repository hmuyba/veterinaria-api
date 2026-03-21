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
import { CreateOwnerDto } from './dto/create-owner.dto';
import { OwnersService } from './owners.service';

@ApiTags('Owners')
@ApiBearerAuth('access-token')
@Controller('owners')
@UseGuards(JwtAuthGuard)
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear perfil de propietario vinculado al usuario autenticado' })
  @ApiResponse({ status: 201, description: 'Propietario creado' })
  @ApiResponse({ status: 409, description: 'El usuario ya tiene un perfil de propietario' })
  create(@CurrentUser() user: User, @Body() dto: CreateOwnerDto) {
    return this.ownersService.create(user, dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  @ApiOperation({ summary: 'Listar todos los propietarios con sus mascotas (solo VETERINARIO)' })
  @ApiResponse({ status: 200, description: 'Lista de propietarios' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  findAll(@CurrentUser() user: User) {
    return this.ownersService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener propietario con sus mascotas. PROPIETARIO solo puede ver el suyo.' })
  @ApiResponse({ status: 200, description: 'Propietario encontrado' })
  @ApiResponse({ status: 404, description: 'Propietario no encontrado' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ownersService.findOne(id, user);
  }
}
