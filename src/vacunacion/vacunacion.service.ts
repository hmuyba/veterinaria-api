import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet } from '../pacientes/entities/pet.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { Vaccine } from './entities/vaccine.entity';

@Injectable()
export class VacunacionService {
  constructor(
    @InjectRepository(Vaccine) private vaccinesRepo: Repository<Vaccine>,
    @InjectRepository(Pet) private petsRepo: Repository<Pet>,
    @InjectRepository(Owner) private ownersRepo: Repository<Owner>,
  ) {}

  async create(veterinario: User, dto: CreateVaccineDto): Promise<Vaccine> {
    const pet = await this.petsRepo.findOne({ where: { id: dto.pet_id } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    const vaccine = this.vaccinesRepo.create({
      pet,
      veterinario,
      clinic: veterinario.clinic,
      tipo_vacuna: dto.tipo_vacuna,
      fecha_aplicacion: new Date(dto.fecha_aplicacion),
      fecha_proxima: dto.fecha_proxima ? new Date(dto.fecha_proxima) : undefined,
    });

    return this.vaccinesRepo.save(vaccine);
  }

  async findByPet(petId: string, user: User): Promise<Vaccine[]> {
    const pet = await this.petsRepo.findOne({
      where: { id: petId },
      relations: ['owner', 'owner.user', 'clinic'],
    });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    if (user.role.nombre !== RoleName.SUPER_ADMIN) {
      if (pet.clinic?.id !== user.clinic?.id) throw new ForbiddenException();
    }

    if (user.role.nombre === RoleName.PROPIETARIO) {
      if (pet.owner?.user?.id !== user.id) throw new ForbiddenException();
    }

    return this.vaccinesRepo.find({
      where: { pet: { id: petId } },
      relations: ['veterinario', 'pet'],
      order: { fecha_aplicacion: 'ASC' },
    });
  }

  findPending(user: User): Promise<Vaccine[]> {
    const limit = new Date();
    limit.setDate(limit.getDate() + 7);

    const qb = this.vaccinesRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.pet', 'pet')
      .leftJoinAndSelect('pet.owner', 'owner')
      .leftJoinAndSelect('owner.user', 'user')
      .leftJoinAndSelect('v.veterinario', 'veterinario')
      .where('v.fecha_proxima IS NOT NULL')
      .andWhere('v.fecha_proxima <= :limit', { limit })
      .andWhere('v.notificado = :notificado', { notificado: false });

    if (user.role.nombre !== RoleName.SUPER_ADMIN) {
      qb.andWhere('v.clinic_id = :clinicId', { clinicId: user.clinic?.id });
    }

    return qb.orderBy('v.fecha_proxima', 'ASC').getMany();
  }

  async update(id: string, dto: UpdateVaccineDto): Promise<Vaccine> {
    const vaccine = await this.vaccinesRepo.findOne({ where: { id } });
    if (!vaccine) throw new NotFoundException('Vacuna no encontrada');

    const merged = this.vaccinesRepo.merge(vaccine, {
      ...dto,
      fecha_aplicacion: dto.fecha_aplicacion
        ? new Date(dto.fecha_aplicacion)
        : vaccine.fecha_aplicacion,
      fecha_proxima: dto.fecha_proxima
        ? new Date(dto.fecha_proxima)
        : vaccine.fecha_proxima,
    });

    return this.vaccinesRepo.save(merged);
  }
}
