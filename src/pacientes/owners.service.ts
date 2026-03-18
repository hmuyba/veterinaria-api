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

    const owner = this.ownersRepo.create({ ...dto, user });
    return this.ownersRepo.save(owner);
  }

  findAll(): Promise<Owner[]> {
    return this.ownersRepo.find({ relations: ['user', 'pets'] });
  }

  async findOne(id: string, user: User): Promise<Owner> {
    const owner = await this.ownersRepo.findOne({
      where: { id },
      relations: ['user', 'pets'],
    });

    if (!owner) throw new NotFoundException('Propietario no encontrado');

    if (
      user.role.nombre === RoleName.PROPIETARIO &&
      owner.user.id !== user.id
    ) {
      throw new ForbiddenException();
    }

    return owner;
  }
}
