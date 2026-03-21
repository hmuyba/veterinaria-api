import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { User } from '../../auth/entities/user.entity';
import { Pet } from '../../pacientes/entities/pet.entity';

@Entity('vaccines')
export class Vaccine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', eager: false })
  @JoinColumn({ name: 'veterinario_id' })
  veterinario: User;

  @Column()
  tipo_vacuna: string;

  @Column({ type: 'date' })
  fecha_aplicacion: Date;

  @Column({ type: 'date', nullable: true })
  fecha_proxima: Date;

  @Column({ default: false })
  notificado: boolean;

  @ManyToOne(() => Clinic, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic | null;
}
