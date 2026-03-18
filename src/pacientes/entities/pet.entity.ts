import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Owner } from './owner.entity';

export enum Especie {
  CANINO = 'CANINO',
  FELINO = 'FELINO',
  OTRO = 'OTRO',
}

export enum Sexo {
  MACHO = 'MACHO',
  HEMBRA = 'HEMBRA',
}

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Owner, (owner) => owner.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;

  @Column()
  nombre: string;

  @Column({ type: 'enum', enum: Especie })
  especie: Especie;

  @Column({ nullable: true })
  raza: string;

  @Column({ type: 'enum', enum: Sexo })
  sexo: Sexo;

  @Column({ type: 'date', nullable: true })
  fecha_nac: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number;
}
