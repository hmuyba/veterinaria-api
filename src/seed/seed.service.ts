import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';
import { Role, RoleName } from '../auth/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { Owner } from '../pacientes/entities/owner.entity';
import { Pet, Especie, Sexo } from '../pacientes/entities/pet.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private config: ConfigService,
    @InjectRepository(Clinic) private clinicsRepo: Repository<Clinic>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Owner) private ownersRepo: Repository<Owner>,
    @InjectRepository(Pet) private petsRepo: Repository<Pet>,
  ) {}

  async onModuleInit() {
    if (this.config.get<string>('SEED_DATA') !== 'true') return;
    this.logger.log('SEED_DATA=true — ejecutando seed de prueba...');
    await this.run();
    this.logger.log('Seed completado.');
  }

  async run() {
    // ── Clínica ────────────────────────────────────────────────────────────────
    let clinic = await this.clinicsRepo.findOne({
      where: { nombre: 'Clínica Veterinaria San Martín' },
    });

    if (!clinic) {
      clinic = await this.clinicsRepo.save(
        this.clinicsRepo.create({
          nombre: 'Clínica Veterinaria San Martín',
          direccion: 'Av. Arce 1234, La Paz',
          telefono: '22123456',
          activa: true,
        }),
      );
      this.logger.log(`Clínica creada: ${clinic.nombre} (${clinic.id})`);
    } else {
      this.logger.log(`Clínica ya existe: ${clinic.nombre} (${clinic.id})`);
    }

    // ── Roles ──────────────────────────────────────────────────────────────────
    const roleVet = await this.rolesRepo.findOneOrFail({
      where: { nombre: RoleName.VETERINARIO },
    });
    const roleProp = await this.rolesRepo.findOneOrFail({
      where: { nombre: RoleName.PROPIETARIO },
    });

    // ── Veterinario ────────────────────────────────────────────────────────────
    await this.upsertUser({
      email: 'vet@sanmartin.com',
      password: 'Vet1234!',
      nombre: 'Dr. Roberto Medina',
      telefono: '76543210',
      role: roleVet,
      clinic,
    });

    // ── Propietarios + Mascotas ────────────────────────────────────────────────
    const propietarios: Array<{
      email: string;
      nombre: string;
      telefono: string;
      ci: string;
      direccion: string;
      pets: Array<{
        nombre: string;
        especie: Especie;
        raza: string;
        sexo: Sexo;
        fecha_nac: string;
        peso: number;
      }>;
    }> = [
      {
        email: 'carlos.mamani@gmail.com',
        nombre: 'Carlos Mamani',
        telefono: '71234567',
        ci: '4521897',
        direccion: 'Calle Murillo 456, La Paz',
        pets: [
          {
            nombre: 'Rocky',
            especie: Especie.CANINO,
            raza: 'Labrador',
            sexo: Sexo.MACHO,
            fecha_nac: '2020-03-15',
            peso: 28.5,
          },
        ],
      },
      {
        email: 'ana.flores@gmail.com',
        nombre: 'Ana Flores',
        telefono: '72345678',
        ci: '6789012',
        direccion: 'Av. 6 de Agosto 789, La Paz',
        pets: [
          {
            nombre: 'Luna',
            especie: Especie.FELINO,
            raza: 'Persa',
            sexo: Sexo.HEMBRA,
            fecha_nac: '2021-07-20',
            peso: 4.2,
          },
          {
            nombre: 'Max',
            especie: Especie.CANINO,
            raza: 'Golden Retriever',
            sexo: Sexo.MACHO,
            fecha_nac: '2019-11-05',
            peso: 32.0,
          },
        ],
      },
      {
        email: 'jorge.quispe@gmail.com',
        nombre: 'Jorge Quispe',
        telefono: '73456789',
        ci: '9012345',
        direccion: 'Calle Potosí 321, La Paz',
        pets: [
          {
            nombre: 'Nala',
            especie: Especie.FELINO,
            raza: 'Siamés',
            sexo: Sexo.HEMBRA,
            fecha_nac: '2022-01-10',
            peso: 3.8,
          },
        ],
      },
    ];

    for (const data of propietarios) {
      const user = await this.upsertUser({
        email: data.email,
        password: 'Prop1234!',
        nombre: data.nombre,
        telefono: data.telefono,
        role: roleProp,
        clinic,
      });

      let owner = await this.ownersRepo.findOne({
        where: { user: { id: user.id } },
      });

      if (!owner) {
        owner = await this.ownersRepo.save(
          this.ownersRepo.create({
            user,
            clinic,
            ci: data.ci,
            direccion: data.direccion,
          }),
        );
        this.logger.log(`Owner creado: ${data.nombre}`);
      }

      for (const petData of data.pets) {
        const exists = await this.petsRepo.findOne({
          where: { nombre: petData.nombre, owner: { id: owner.id } },
        });
        if (!exists) {
          await this.petsRepo.save(
            this.petsRepo.create({
              ...petData,
              fecha_nac: new Date(petData.fecha_nac),
              owner,
              clinic,
            }),
          );
          this.logger.log(`  Mascota creada: ${petData.nombre}`);
        }
      }
    }
  }

  private async upsertUser(data: {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
    role: Role;
    clinic: Clinic;
  }): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      this.logger.log(`Usuario ya existe: ${data.email}`);
      return existing;
    }

    const user = await this.usersRepo.save(
      this.usersRepo.create({
        email: data.email,
        password_hash: await bcrypt.hash(data.password, 10),
        nombre: data.nombre,
        telefono: data.telefono,
        role: data.role,
        clinic: data.clinic,
      }),
    );
    this.logger.log(`Usuario creado: ${data.email}`);
    return user;
  }
}
