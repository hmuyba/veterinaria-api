import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'JWT refresh token obtenido en el login' })
  @IsString()
  refresh_token: string;
}
