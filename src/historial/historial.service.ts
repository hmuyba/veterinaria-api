import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet } from '../pacientes/entities/pet.entity';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { Treatment } from './entities/treatment.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(ClinicalRecord)
    private recordsRepo: Repository<ClinicalRecord>,
    @InjectRepository(Treatment)
    private treatmentsRepo: Repository<Treatment>,
    @InjectRepository(Pet)
    private petsRepo: Repository<Pet>,
    @InjectRepository(Owner)
    private ownersRepo: Repository<Owner>,
  ) {}

  async create(
    veterinario: User,
    dto: CreateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    const pet = await this.petsRepo.findOne({ where: { id: dto.pet_id } });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    const record = this.recordsRepo.create({
      pet,
      veterinario,
      clinic: veterinario.clinic,
      motivo: dto.motivo,
      diagnostico: dto.diagnostico,
      observaciones: dto.observaciones,
    });

    const saved = await this.recordsRepo.save(record);

    if (dto.treatments?.length) {
      const treatments = dto.treatments.map((t) =>
        this.treatmentsRepo.create({ ...t, clinicalRecord: saved }),
      );
      await this.treatmentsRepo.save(treatments);
    }

    return this.loadRecord(saved.id);
  }

  async findByPet(petId: string, user: User): Promise<ClinicalRecord[]> {
    const pet = await this.petsRepo.findOne({
      where: { id: petId },
      relations: ['owner', 'owner.user', 'clinic'],
    });
    if (!pet) throw new NotFoundException('Mascota no encontrada');

    if (user.role.nombre !== RoleName.SUPER_ADMIN) {
      if (pet.clinic?.id !== user.clinic?.id) throw new ForbiddenException();
    }

    if (user.role.nombre === RoleName.PROPIETARIO) {
      this.assertOwnership(pet, user);
    }

    return this.recordsRepo.find({
      where: { pet: { id: petId } },
      relations: ['treatments', 'veterinario', 'pet'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<ClinicalRecord> {
    const record = await this.recordsRepo.findOne({
      where: { id },
      relations: [
        'treatments',
        'veterinario',
        'pet',
        'pet.owner',
        'pet.owner.user',
        'clinic',
      ],
    });
    if (!record) throw new NotFoundException('Consulta clínica no encontrada');

    if (user.role.nombre !== RoleName.SUPER_ADMIN) {
      if (record.clinic?.id !== user.clinic?.id) throw new ForbiddenException();
    }

    if (user.role.nombre === RoleName.PROPIETARIO) {
      this.assertOwnership(record.pet, user);
    }

    return record;
  }

  // ─── helpers ────────────────────────────────────────────────────────────────

  /** Throws 403 if the pet's owner is not the authenticated user. */
  private assertOwnership(pet: Pet, user: User): void {
    if (pet.owner?.user?.id !== user.id) throw new ForbiddenException();
  }

  private async loadRecord(id: string): Promise<ClinicalRecord> {
    return this.recordsRepo.findOneOrFail({
      where: { id },
      relations: ['treatments', 'veterinario', 'pet'],
    });
  }
}
