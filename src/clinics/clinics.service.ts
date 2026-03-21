import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from './entities/clinic.entity';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic) private clinicsRepo: Repository<Clinic>,
  ) {}

  create(dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicsRepo.create(dto);
    return this.clinicsRepo.save(clinic);
  }

  findAll(): Promise<Clinic[]> {
    return this.clinicsRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.clinicsRepo.findOne({ where: { id } });
    if (!clinic) throw new NotFoundException('Clínica no encontrada');
    return clinic;
  }

  async update(id: string, dto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);
    const updated = this.clinicsRepo.merge(clinic, dto);
    return this.clinicsRepo.save(updated);
  }
}
