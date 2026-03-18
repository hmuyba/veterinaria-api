import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { HistorialService } from './historial.service';

@Controller('clinical-records')
@UseGuards(JwtAuthGuard)
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleName.VETERINARIO)
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateClinicalRecordDto,
  ) {
    return this.historialService.create(user, dto);
  }

  @Get('pet/:petId')
  findByPet(@Param('petId') petId: string, @CurrentUser() user: User) {
    return this.historialService.findByPet(petId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.historialService.findOne(id, user);
  }
}
