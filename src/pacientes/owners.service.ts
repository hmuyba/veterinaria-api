import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { Owner } from './entities/owner.entity';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner) private ownersRepo: Repository<Owner>,
  ) {}

  async create(user: User, dto: CreateOwnerDto): Promise<Owner> {
    const existing = await this.ownersRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existing) {
      throw new ConflictException('El usuario ya tiene un perfil de propietario');
    }

    const owner = this.ownersRepo.create({ ...dto, user, clinic: user.clinic });
    return this.ownersRepo.save(owner);
  }

  findAll(user: User, search?: string): Promise<Owner[]> {
    const qb = this.ownersRepo
      .createQueryBuilder('owner')
      .leftJoinAndSelect('owner.user', 'u')
      .leftJoinAndSelect('owner.pets', 'pets')
      .leftJoinAndSelect('owner.clinic', 'clinic');

    if (user.role.nombre === RoleName.PROPIETARIO) {
      qb.where('u.id = :userId', { userId: user.id });
    } else if (user.role.nombre === RoleName.VETERINARIO) {
      qb.where('owner.clinic_id = :clinicId', { clinicId: user.clinic?.id });
    }
    // SUPER_ADMIN: sin filtro de clínica

    if (search) {
      const term = `%${search.toLowerCase()}%`;
      qb.andWhere(
        'LOWER(u.nombre) LIKE :term OR LOWER(u.email) LIKE :term OR LOWER(u.telefono) LIKE :term',
        { term },
      );
    }

    return qb.orderBy('u.nombre', 'ASC').getMany();
  }

  async findOne(id: string, user: User): Promise<Owner> {
    const owner = await this.ownersRepo.findOne({
      where: { id },
      relations: ['user', 'pets', 'clinic'],
    });

    if (!owner) throw new NotFoundException('Propietario no encontrado');

    if (user.role.nombre === RoleName.SUPER_ADMIN) return owner;

    if (owner.clinic?.id !== user.clinic?.id) throw new ForbiddenException();

    if (
      user.role.nombre === RoleName.PROPIETARIO &&
      owner.user.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    return owner;
  }
}
