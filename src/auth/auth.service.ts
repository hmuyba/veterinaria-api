import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Role, RoleName } from './entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const roles = [
      {
        nombre: RoleName.VETERINARIO,
        descripcion:
          'Profesional veterinario con acceso completo a registros clínicos',
      },
      {
        nombre: RoleName.PROPIETARIO,
        descripcion:
          'Propietario de mascotas con acceso a sus propios pacientes',
      },
    ];

    for (const role of roles) {
      const exists = await this.rolesRepo.findOne({
        where: { nombre: role.nombre },
      });
      if (!exists) {
        await this.rolesRepo.save(this.rolesRepo.create(role));
      }
    }
  }

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('El email ya está registrado');

    const role = await this.rolesRepo.findOneOrFail({
      where: { nombre: RoleName.PROPIETARIO },
    });

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      password_hash,
      nombre: dto.nombre,
      telefono: dto.telefono,
      role,
    });

    await this.usersRepo.save(user);
    return { message: 'Usuario registrado correctamente', id: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user, tokens.refresh_token);
    return tokens;
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwtService.verify(dto.refresh_token, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
    if (!user?.refresh_token_hash) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    const valid = await bcrypt.compare(
      dto.refresh_token,
      user.refresh_token_hash,
    );
    if (!valid) throw new UnauthorizedException('Refresh token inválido');

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user, tokens.refresh_token);
    return tokens;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role.nombre };

    const access_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_EXPIRATION') as any,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow<string>('JWT_REFRESH_EXPIRATION') as any,
    });

    return { access_token, refresh_token };
  }

  private async saveRefreshToken(user: User, refreshToken: string) {
    user.refresh_token_hash = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.save(user);
  }
}
