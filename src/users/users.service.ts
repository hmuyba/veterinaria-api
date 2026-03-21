import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  findVeterinarios(): Promise<User[]> {
    return this.usersRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.role', 'role')
      .leftJoinAndSelect('u.clinic', 'clinic')
      .where('role.nombre = :role', { role: RoleName.VETERINARIO })
      .orderBy('u.nombre', 'ASC')
      .getMany();
  }

  findVeterinariosByClinic(clinicId: string): Promise<User[]> {
    return this.usersRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.role', 'role')
      .leftJoinAndSelect('u.clinic', 'clinic')
      .where('role.nombre = :role', { role: RoleName.VETERINARIO })
      .andWhere('u.clinic_id = :clinicId', { clinicId })
      .orderBy('u.nombre', 'ASC')
      .getMany();
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.usersRepo.remove(user);
  }
}
