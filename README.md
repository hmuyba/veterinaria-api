# Veterinaria API

## Descripción
API REST para la gestión clínica veterinaria con registro de pacientes animales, 
propietarios, historial clínico, tratamientos y vacunaciones.

## Objetivo general
Proveer los servicios backend para una aplicación móvil de gestión de clínicas 
veterinarias de pequeña y mediana escala.

## Stack tecnológico
- **Runtime:** Node.js 20+
- **Framework:** NestJS (TypeScript)
- **Base de datos:** PostgreSQL 16
- **ORM:** TypeORM
- **Autenticación:** JWT (access + refresh tokens)
- **Autorización:** RBAC con Guards
- **Contenedorización:** Docker + Docker Compose

## Arquitectura
App Móvil (Flutter) → API REST (NestJS) → PostgreSQL

## Módulos del sistema
- Auth (registro, login, JWT, refresh token, guards RBAC)
- Pacientes (owners + pets)
- Historial Clínico (clinical_records + treatments)
- Vacunación (vaccines)

## Endpoints core
(Se documentarán conforme se desarrollen)

## Cómo ejecutar en local
1. Clonar repositorio
2. Copiar `.env.example` a `.env`
3. Ejecutar `docker compose up -d`
4. La API estará en `http://localhost:3000`

## Variables de entorno
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=veterinaria
JWT_SECRET=tu_secret_key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```

## Autor
Harold Muyba Castro — Maestría Full Stack Development, UCB