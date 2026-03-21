import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Owner } from './entities/owner.entity';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private petsRepo: Repository<Pet>,
    @InjectRepository(Owner) private ownersRepo: Repository<Owner>,
  ) {}

  async create(dto: CreatePetDto): Promise<Pet> {
    const owner = await this.ownersRepo.findOne({
      where: { id: dto.owner_id },
      relations: ['clinic'],
    });
    if (!owner) throw new NotFoundException('Propietario no encontrado');

    const pet = this.petsRepo.create({
      nombre: dto.nombre,
      especie: dto.especie,
      raza: dto.raza,
      sexo: dto.sexo,
      fecha_nac: dto.fecha_nac ? new Date(dto.fecha_nac) : undefined,
      peso: dto.peso,
      owner,
      clinic: owner.clinic,
    });

    return this.petsRepo.save(pet);
  }

  async findAll(user: User): Promise<Pet[]> {
    if (user.role.nombre === RoleName.SUPER_ADMIN) {
      return this.petsRepo.find({ relations: ['owner', 'owner.user', 'clinic'] });
    }

    if (user.role.nombre === RoleName.VETERINARIO) {
      return this.petsRepo.find({
        where: { clinic: { id: user.clinic?.id } },
        relations: ['owner', 'owner.user'],
      });
    }

    // PROPIETARIO: solo sus mascotas
    const owner = await this.ownersRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!owner) return [];

    return this.petsRepo.find({
      where: { owner: { id: owner.id } },
      relations: ['owner', 'owner.user'],
    });
  }

  async findOne(id: string, user: User): Promise<Pet> {
    const pet = await this.petsRepo.findOne({
      where: { id },
      relations: ['owner', 'owner.user', 'clinic'],
    });

    if (!pet) throw new NotFoundException('Mascota no encontrada');

    if (user.role.nombre === RoleName.SUPER_ADMIN) return pet;

    if (pet.clinic?.id !== user.clinic?.id) throw new ForbiddenException();

    if (
      user.role.nombre === RoleName.PROPIETARIO &&
      pet.owner.user.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    return pet;
  }

  async update(id: string, dto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petsRepo.findOne({ where: { id } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    const updated = this.petsRepo.merge(pet, {
      ...dto,
      fecha_nac: dto.fecha_nac ? new Date(dto.fecha_nac) : pet.fecha_nac,
    });

    return this.petsRepo.save(updated);
  }
}
