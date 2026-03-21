import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { User } from '../../auth/entities/user.entity';
import { Pet } from '../../pacientes/entities/pet.entity';
import { Treatment } from './treatment.entity';

@Entity('clinical_records')
export class ClinicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pet, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => User, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'veterinario_id' })
  veterinario: User;

  @ManyToOne(() => Clinic, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  fecha: Date;

  @Column()
  motivo: string;

  @Column({ type: 'text' })
  diagnostico: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @OneToMany(() => Treatment, (t) => t.clinicalRecord, { cascade: true })
  treatments: Treatment[];
}
