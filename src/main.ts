import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Swagger ──────────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Veterinaria API')
    .setDescription(
      'API REST para gestión clínica veterinaria. ' +
      'Autenticarse con POST /auth/login → copiar el access_token → ' +
      'hacer clic en el botón "Authorize" e ingresar: Bearer <token>',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Registro, login y refresh de tokens')
    .addTag('Owners', 'Gestión de propietarios')
    .addTag('Pets', 'Gestión de mascotas')
    .addTag('Historial', 'Consultas clínicas y tratamientos')
    .addTag('Vacunación', 'Registro y seguimiento de vacunas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // ─────────────────────────────────────────────────────────────────────────────

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api`);
}
bootstrap();
