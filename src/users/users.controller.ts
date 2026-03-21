import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('veterinarios')
  @ApiOperation({ summary: 'Listar todos los veterinarios con su clínica asignada (solo SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarios' })
  findVeterinarios() {
    return this.usersService.findVeterinarios();
  }

  @Get('veterinarios/:clinicId')
  @ApiOperation({ summary: 'Listar veterinarios de una clínica específica (solo SUPER_ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de veterinarios de la clínica' })
  findByClinic(@Param('clinicId') clinicId: string) {
    return this.usersService.findVeterinariosByClinic(clinicId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (solo SUPER_ADMIN)' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
