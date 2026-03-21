import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { User } from '../../auth/entities/user.entity';
import { Pet } from './pet.entity';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Clinic, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic | null;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  ci: string;

  @OneToMany(() => Pet, (pet) => pet.owner, { cascade: true })
  pets: Pet[];
}
