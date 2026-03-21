import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ default: true })
  activa: boolean;
}
