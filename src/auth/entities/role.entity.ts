import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  VETERINARIO = 'VETERINARIO',
  PROPIETARIO = 'PROPIETARIO',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nombre: RoleName;

  @Column()
  descripcion: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
