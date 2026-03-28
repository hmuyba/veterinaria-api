# Veterinaria API

> API REST para la gestión integral de clínicas veterinarias: pacientes, historial clínico, vacunaciones y control de acceso multirol.

![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

---

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación y Ejecución](#instalación-y-ejecución)
6. [Variables de Entorno](#variables-de-entorno)
7. [Seed de Datos Iniciales](#seed-de-datos-iniciales)
8. [Modelo de Base de Datos](#modelo-de-base-de-datos)
9. [Endpoints de la API](#endpoints-de-la-api)
10. [Autenticación y Seguridad](#autenticación-y-seguridad)
11. [Estructura del Proyecto](#estructura-del-proyecto)
12. [Scripts Disponibles](#scripts-disponibles)
13. [Documentación Swagger](#documentación-swagger)
14. [Frontend Relacionado](#frontend-relacionado)
15. [Autor](#autor)

---

## Descripción

**Veterinaria API** es el backend de un sistema de gestión clínica veterinaria diseñado para clínicas de pequeña y mediana escala. Expone una API REST que permite:

- Registrar y gestionar propietarios de mascotas y sus animales
- Llevar el historial clínico completo con diagnósticos y tratamientos
- Controlar el calendario de vacunaciones y alertas de vencimiento
- Administrar múltiples clínicas con veterinarios asignados
- Controlar el acceso mediante autenticación JWT y roles (RBAC)

El sistema está diseñado como backend de la aplicación móvil Flutter de gestión veterinaria.

---

## Arquitectura del Sistema

### Monolito Modular

La aplicación sigue el patrón de **Monolito Modular**: un único proceso desplegable organizado internamente en módulos independientes con responsabilidades claras. Cada módulo encapsula su propio controlador, servicio, entidades y DTOs.

```
┌─────────────────────────────────────────────────────────┐
│                    Flutter App (Móvil)                  │
│                  HTTP + Bearer Token                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              API REST — NestJS (TypeScript)              │
│                                                         │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌───────────────┐ │
│  │  Auth   │ │ Pacientes│ │Historial│ │  Vacunación   │ │
│  │  Module │ │  Module  │ │ Module  │ │    Module     │ │
│  └─────────┘ └──────────┘ └────────┘ └───────────────┘ │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────────────┐ │
│  │  Clinics │ │  Users   │ │       Seed Module        │ │
│  │  Module  │ │  Module  │ │  (datos iniciales)       │ │
│  └──────────┘ └──────────┘ └─────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │          JWT Guards + RBAC (3 roles)            │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────┘
                           │ TypeORM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL 16                          │
│   roles · users · clinics · owners · pets              │
│   clinical_records · treatments · vaccines             │
└─────────────────────────────────────────────────────────┘
```

### Módulos del Sistema

| Módulo           | Responsabilidad                                                    |
|------------------|--------------------------------------------------------------------|
| **Auth**         | Registro, login, refresh token, JWT, RBAC, perfil de usuario       |
| **Clinics**      | CRUD de clínicas veterinarias                                      |
| **Users**        | Gestión de veterinarios (listar, eliminar)                         |
| **Owners**       | Registro y búsqueda de propietarios de mascotas                    |
| **Pets**         | CRUD de mascotas vinculadas a propietarios                         |
| **ClinicalRecords** | Historial clínico con diagnósticos y tratamientos anidados      |
| **Vaccines**     | Registro de vacunas y alertas de vencimiento próximo               |
| **Seed**         | Creación automática de datos iniciales de prueba                   |

---

## Stack Tecnológico

| Tecnología         | Versión   | Uso                                     |
|--------------------|-----------|-----------------------------------------|
| Node.js            | 20+       | Runtime de JavaScript/TypeScript        |
| NestJS             | 11.x      | Framework backend (controladores, DI)   |
| TypeScript         | 5.x       | Tipado estático                         |
| PostgreSQL         | 16        | Base de datos relacional                |
| TypeORM            | 0.3.28    | ORM para mapeo objeto-relacional        |
| Passport.js        | 0.7       | Middleware de autenticación             |
| passport-jwt       | 4.0.1     | Estrategia JWT para Passport            |
| @nestjs/jwt        | 11.0.2    | Generación y verificación de JWT        |
| bcrypt             | 6.0.0     | Hash seguro de contraseñas              |
| class-validator    | 0.15.1    | Validación declarativa de DTOs          |
| class-transformer  | 0.5.1     | Serialización y exclusión de campos     |
| @nestjs/swagger    | 11.2.6    | Documentación OpenAPI automática        |
| Docker             | 27+       | Contenedorización                       |
| Docker Compose     | 2.x       | Orquestación de servicios locales       |

---

## Requisitos Previos

Antes de instalar el proyecto, asegurarse de tener instalado:

| Herramienta    | Versión mínima | Verificación           |
|----------------|----------------|------------------------|
| Node.js        | 20.x           | `node --version`       |
| npm            | 10.x           | `npm --version`        |
| Docker         | 27.x           | `docker --version`     |
| Docker Compose | 2.x            | `docker compose version` |
| Git            | 2.x            | `git --version`        |

---

## Instalación y Ejecución

### Paso 1 — Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd veterinaria-api
```

### Paso 2 — Instalar dependencias

```bash
npm install
```

### Paso 3 — Configurar variables de entorno

Copiar el archivo de ejemplo y editarlo según el entorno local:

```bash
cp .env.example .env
```

Abrir `.env` y ajustar los valores (ver sección [Variables de Entorno](#variables-de-entorno)).

> **Importante:** Para desarrollo local los valores por defecto del `.env.example` funcionan sin cambios. Solo es necesario cambiar los secretos JWT en entornos de producción.

### Paso 4 — Levantar PostgreSQL con Docker

```bash
docker compose up -d postgres
```

Esto inicia el contenedor `veterinaria_postgres` con PostgreSQL 16 en el puerto configurado (por defecto `5432`). Los datos persisten en el volumen `postgres_data`.

Para verificar que el contenedor está corriendo:

```bash
docker compose ps
```

### Paso 5 — Ejecutar el backend en modo desarrollo

```bash
npm run start:dev
```

NestJS iniciará con hot-reload. En el arranque, el sistema automáticamente:
- Sincroniza el esquema de base de datos (crea las tablas)
- Crea los 3 roles base (SUPER_ADMIN, VETERINARIO, PROPIETARIO)
- Crea el usuario Super Admin desde las variables de entorno
- Si `SEED_DATA=true`, crea una clínica, un veterinario y 3 propietarios con mascotas de prueba

### Paso 6 — Verificar que la API responde

```
GET http://localhost:3000
```

La API también expone documentación Swagger en:

```
http://localhost:3000/api
```

### Ejecución completa con Docker (opcional)

Para levantar tanto la API como la base de datos en contenedores:

```bash
docker compose --profile full up -d
```

> Este modo usa el `Dockerfile` del proyecto para construir la imagen de la API.

---

## Variables de Entorno

El archivo `.env.example` contiene todas las variables requeridas:

| Variable                  | Descripción                                        | Valor por defecto               |
|---------------------------|----------------------------------------------------|---------------------------------|
| `APP_PORT`                | Puerto en que escucha la API                       | `3000`                          |
| `NODE_ENV`                | Entorno de ejecución                               | `development`                   |
| `DB_HOST`                 | Host del servidor PostgreSQL                       | `localhost`                     |
| `DB_PORT`                 | Puerto de PostgreSQL                               | `5432`                          |
| `DB_USERNAME`             | Usuario de la base de datos                        | `postgres`                      |
| `DB_PASSWORD`             | Contraseña de la base de datos                     | `postgres`                      |
| `DB_DATABASE`             | Nombre de la base de datos                         | `veterinaria`                   |
| `JWT_SECRET`              | Secreto para firmar access tokens                  | *(debe cambiarse en producción)*|
| `JWT_REFRESH_SECRET`      | Secreto para firmar refresh tokens                 | *(debe cambiarse en producción)*|
| `JWT_EXPIRATION`          | Tiempo de vida del access token                    | `15m`                           |
| `JWT_REFRESH_EXPIRATION`  | Tiempo de vida del refresh token                   | `7d`                            |
| `SUPER_ADMIN_EMAIL`       | Email del usuario administrador inicial            | `admin@veterinaria.com`         |
| `SUPER_ADMIN_PASSWORD`    | Contraseña del administrador inicial               | *(debe cambiarse en producción)*|
| `SUPER_ADMIN_NOMBRE`      | Nombre del administrador inicial                   | `Super Administrador`           |
| `SEED_DATA`               | Si es `true`, inserta datos de prueba al arrancar  | `false`                         |

> **Seguridad:** Nunca subir el archivo `.env` al repositorio. El `.gitignore` ya lo excluye.

---

## Seed de Datos Iniciales

### Seed automático al arrancar (siempre)

Al iniciar la aplicación, el módulo `Auth` ejecuta automáticamente:

1. **Creación de roles** (si no existen):
   - `SUPER_ADMIN` — Administrador total del sistema
   - `VETERINARIO` — Profesional médico de una clínica
   - `PROPIETARIO` — Dueño de mascotas registradas

2. **Creación del Super Admin** (si no existe), usando los valores de `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` y `SUPER_ADMIN_NOMBRE` del `.env`.

### Seed de datos de prueba (`SEED_DATA=true`)

Si la variable `SEED_DATA=true` está definida en el `.env`, se crean los siguientes datos de prueba adicionales:

**Clínica:**
| Campo     | Valor                              |
|-----------|------------------------------------|
| Nombre    | Clínica Veterinaria San Martín     |
| Dirección | Av. Arce 1234, La Paz              |
| Teléfono  | 22123456                           |

**Veterinario:**
| Campo    | Valor                          |
|----------|--------------------------------|
| Email    | `vet@sanmartin.com`            |
| Password | `Vet1234!`                     |
| Nombre   | Dr. Roberto Medina             |
| Teléfono | 76543210                       |
| Rol      | VETERINARIO                    |
| Clínica  | Clínica Veterinaria San Martín |

**Propietarios y mascotas:**

| Propietario       | Email                      | Password   | Mascota(s)                              |
|-------------------|----------------------------|------------|-----------------------------------------|
| Carlos Mamani     | carlos.mamani@gmail.com    | `Prop1234!`| Rocky (Canino, Labrador, M, 28.5 kg)   |
| Ana Flores        | ana.flores@gmail.com       | `Prop1234!`| Luna (Felino, Persa, H, 4.2 kg) · Max (Canino, Golden, M, 32 kg) |
| Jorge Quispe      | jorge.quispe@gmail.com     | `Prop1234!`| Nala (Felino, Siamés, H, 3.8 kg)       |

> Todas las contraseñas están hasheadas con bcrypt antes de guardarse en la base de datos.

---

## Modelo de Base de Datos

El sistema utiliza **8 tablas** en PostgreSQL:

### Diagrama de relaciones

```
roles ──< users >── clinics
                     │
         owners ─────┘
           │
          pets ──< vaccines
           │
    clinical_records ──< treatments
```

### Descripción de entidades

#### `roles`
Almacena los 3 roles del sistema.

| Campo       | Tipo    | Descripción                              |
|-------------|---------|------------------------------------------|
| `id`        | uuid    | Clave primaria                           |
| `nombre`    | enum    | `SUPER_ADMIN` \| `VETERINARIO` \| `PROPIETARIO` |
| `descripcion` | string | Descripción del rol                    |

#### `users`
Usuarios del sistema (administradores, veterinarios y propietarios).

| Campo               | Tipo    | Descripción                              |
|---------------------|---------|------------------------------------------|
| `id`                | uuid    | Clave primaria                           |
| `role_id`           | uuid FK | Rol asignado (eager loaded)              |
| `clinic_id`         | uuid FK | Clínica asignada (nullable, eager)       |
| `email`             | string  | Único, usado para login                  |
| `password_hash`     | string  | Contraseña hasheada con bcrypt (excluida en respuestas) |
| `nombre`            | string  | Nombre completo                          |
| `telefono`          | string  | Teléfono de contacto (nullable)          |
| `refresh_token_hash`| string  | Hash del refresh token activo (nullable, excluido) |
| `created_at`        | timestamp | Fecha de creación automática           |

#### `clinics`
Clínicas veterinarias registradas en el sistema.

| Campo      | Tipo    | Descripción              |
|------------|---------|--------------------------|
| `id`       | uuid    | Clave primaria           |
| `nombre`   | string  | Nombre de la clínica     |
| `direccion`| string  | Dirección (nullable)     |
| `telefono` | string  | Teléfono (nullable)      |
| `activa`   | boolean | Estado activo/inactivo   |

#### `owners`
Perfil extendido de los propietarios de mascotas.

| Campo       | Tipo    | Descripción                          |
|-------------|---------|--------------------------------------|
| `id`        | uuid    | Clave primaria                       |
| `user_id`   | uuid FK | Relación 1:1 con `users`             |
| `clinic_id` | uuid FK | Clínica asociada (nullable)          |
| `direccion` | string  | Dirección domiciliaria (nullable)    |
| `ci`        | string  | Cédula de identidad (nullable)       |

#### `pets`
Mascotas registradas con sus datos clínicos básicos.

| Campo       | Tipo    | Descripción                                 |
|-------------|---------|---------------------------------------------|
| `id`        | uuid    | Clave primaria                              |
| `owner_id`  | uuid FK | Propietario (CASCADE delete)                |
| `clinic_id` | uuid FK | Clínica donde está registrada (nullable)    |
| `nombre`    | string  | Nombre de la mascota                        |
| `especie`   | enum    | `CANINO` \| `FELINO` \| `OTRO`              |
| `raza`      | string  | Raza (nullable)                             |
| `sexo`      | enum    | `MACHO` \| `HEMBRA`                         |
| `fecha_nac` | date    | Fecha de nacimiento (nullable)              |
| `peso`      | decimal | Peso en kg, precisión 5,2 (nullable)        |

#### `clinical_records`
Registros de consultas clínicas.

| Campo          | Tipo      | Descripción                              |
|----------------|-----------|------------------------------------------|
| `id`           | uuid      | Clave primaria                           |
| `pet_id`       | uuid FK   | Mascota atendida (CASCADE delete)        |
| `veterinario_id` | uuid FK | Veterinario que atendió (RESTRICT delete)|
| `clinic_id`    | uuid FK   | Clínica donde se atendió (nullable)      |
| `fecha`        | timestamptz | Fecha/hora de la consulta (default NOW()) |
| `motivo`       | string    | Motivo de la consulta                    |
| `diagnostico`  | text      | Diagnóstico del veterinario              |
| `observaciones`| text      | Observaciones adicionales (nullable)     |

#### `treatments`
Tratamientos indicados en una consulta clínica.

| Campo                | Tipo    | Descripción                          |
|----------------------|---------|--------------------------------------|
| `id`                 | uuid    | Clave primaria                       |
| `clinical_record_id` | uuid FK | Historial al que pertenece (CASCADE) |
| `medicamento`        | string  | Nombre del medicamento               |
| `dosis`              | string  | Dosis indicada                       |
| `duracion`           | string  | Duración del tratamiento (nullable)  |
| `indicaciones`       | text    | Indicaciones adicionales (nullable)  |

#### `vaccines`
Vacunas aplicadas a una mascota.

| Campo              | Tipo    | Descripción                              |
|--------------------|---------|------------------------------------------|
| `id`               | uuid    | Clave primaria                           |
| `pet_id`           | uuid FK | Mascota vacunada (CASCADE delete)        |
| `veterinario_id`   | uuid FK | Veterinario que aplicó (RESTRICT delete) |
| `clinic_id`        | uuid FK | Clínica donde se aplicó (nullable)       |
| `tipo_vacuna`      | string  | Nombre/tipo de vacuna                    |
| `fecha_aplicacion` | date    | Fecha en que se aplicó                   |
| `fecha_proxima`    | date    | Fecha de la próxima dosis (nullable)     |
| `notificado`       | boolean | Si ya se notificó el vencimiento próximo |

---

## Endpoints de la API

### Módulo Auth — `/auth`

| Método | Ruta                  | Descripción                                    | Rol requerido  |
|--------|-----------------------|------------------------------------------------|----------------|
| POST   | `/auth/register`      | Registra un propietario y crea su perfil Owner | Público        |
| POST   | `/auth/login`         | Inicia sesión, devuelve access + refresh token | Público        |
| POST   | `/auth/refresh`       | Renueva los tokens usando un refresh token     | Público        |
| GET    | `/auth/profile`       | Devuelve el perfil del usuario autenticado     | Autenticado    |
| POST   | `/auth/create-vet`    | Crea un veterinario asignado a una clínica     | SUPER_ADMIN    |

#### Body — `POST /auth/register`
```json
{
  "email": "carlos.mamani@gmail.com",
  "password": "MiPassword123",
  "nombre": "Carlos Mamani",
  "telefono": "71234567",
  "clinic_id": "uuid-de-la-clinica"
}
```

#### Body — `POST /auth/login`
```json
{
  "email": "carlos.mamani@gmail.com",
  "password": "MiPassword123"
}
```

#### Body — `POST /auth/refresh`
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Body — `POST /auth/create-vet`
```json
{
  "email": "dr.nuevo@clinica.com",
  "password": "VetPassword123",
  "nombre": "Dra. María López",
  "telefono": "77654321",
  "clinic_id": "uuid-de-la-clinica"
}
```

---

### Módulo Clinics — `/clinics`

| Método | Ruta           | Descripción                           | Rol requerido |
|--------|----------------|---------------------------------------|---------------|
| GET    | `/clinics`     | Lista todas las clínicas              | Público       |
| GET    | `/clinics/:id` | Obtiene una clínica por ID            | Público       |
| POST   | `/clinics`     | Crea una nueva clínica                | SUPER_ADMIN   |
| PATCH  | `/clinics/:id` | Actualiza datos de una clínica        | SUPER_ADMIN   |

#### Body — `POST /clinics`
```json
{
  "nombre": "Clínica Veterinaria Norte",
  "direccion": "Av. Montes 567, La Paz",
  "telefono": "22345678",
  "activa": true
}
```

---

### Módulo Users — `/users`

| Método | Ruta                              | Descripción                              | Rol requerido |
|--------|-----------------------------------|------------------------------------------|---------------|
| GET    | `/users/veterinarios`             | Lista todos los veterinarios del sistema | SUPER_ADMIN   |
| GET    | `/users/veterinarios/:clinicId`   | Lista veterinarios de una clínica        | SUPER_ADMIN   |
| DELETE | `/users/:id`                      | Elimina un usuario por ID                | SUPER_ADMIN   |

---

### Módulo Owners — `/owners`

| Método | Ruta          | Descripción                                              | Rol requerido             |
|--------|---------------|----------------------------------------------------------|---------------------------|
| POST   | `/owners`     | Completa el perfil del propietario autenticado           | PROPIETARIO               |
| GET    | `/owners`     | Lista propietarios (búsqueda por nombre/email/teléfono)  | VETERINARIO, SUPER_ADMIN  |
| GET    | `/owners/:id` | Obtiene un propietario por ID                            | Autenticado               |

#### Body — `POST /owners`
```json
{
  "direccion": "Calle Murillo 456, La Paz",
  "ci": "4521897"
}
```

> Query param de búsqueda: `GET /owners?search=carlos`

---

### Módulo Pets — `/pets`

| Método | Ruta        | Descripción                                     | Rol requerido |
|--------|-------------|-------------------------------------------------|---------------|
| POST   | `/pets`     | Registra una nueva mascota                      | VETERINARIO   |
| GET    | `/pets`     | Lista mascotas (propietario: las suyas; vet: todas las de su clínica) | Autenticado |
| GET    | `/pets/:id` | Obtiene una mascota por ID                      | Autenticado   |
| PATCH  | `/pets/:id` | Actualiza datos de una mascota                  | VETERINARIO   |

#### Body — `POST /pets`
```json
{
  "owner_id": "uuid-del-propietario",
  "nombre": "Rocky",
  "especie": "CANINO",
  "raza": "Labrador",
  "sexo": "MACHO",
  "fecha_nac": "2020-03-15",
  "peso": 28.5
}
```

---

### Módulo ClinicalRecords — `/clinical-records`

| Método | Ruta                               | Descripción                                | Rol requerido |
|--------|------------------------------------|--------------------------------------------|---------------|
| POST   | `/clinical-records`                | Crea un registro clínico con tratamientos  | VETERINARIO   |
| GET    | `/clinical-records/pet/:petId`     | Lista el historial clínico de una mascota  | Autenticado   |
| GET    | `/clinical-records/:id`            | Obtiene un registro clínico por ID         | Autenticado   |

#### Body — `POST /clinical-records`
```json
{
  "pet_id": "uuid-de-la-mascota",
  "motivo": "Control de rutina",
  "diagnostico": "Animal en buen estado de salud general",
  "observaciones": "Se recomienda dieta balanceada",
  "fecha": "2026-03-28",
  "treatments": [
    {
      "medicamento": "Ivermectina",
      "dosis": "0.5 ml",
      "duracion": "Dosis única",
      "indicaciones": "Aplicar subcutáneo"
    }
  ]
}
```

> El campo `fecha` es opcional; si no se envía, se registra con la fecha/hora actual del servidor.

---

### Módulo Vaccines — `/vaccines`

| Método | Ruta                       | Descripción                                         | Rol requerido |
|--------|----------------------------|-----------------------------------------------------|---------------|
| POST   | `/vaccines`                | Registra una vacuna aplicada a una mascota          | VETERINARIO   |
| GET    | `/vaccines/pending`        | Lista vacunas cuya próxima dosis vence en ≤7 días   | VETERINARIO   |
| GET    | `/vaccines/pet/:petId`     | Lista todas las vacunas de una mascota              | Autenticado   |
| PATCH  | `/vaccines/:id`            | Actualiza datos de una vacuna                       | VETERINARIO   |

#### Body — `POST /vaccines`
```json
{
  "pet_id": "uuid-de-la-mascota",
  "tipo_vacuna": "Antirrábica",
  "fecha_aplicacion": "2026-03-28",
  "fecha_proxima": "2027-03-28"
}
```

---

## Autenticación y Seguridad

### Flujo de Autenticación JWT

```
1. Cliente → POST /auth/login  { email, password }
2. Servidor valida credenciales (bcrypt.compare)
3. Servidor genera:
   - access_token  (firmado con JWT_SECRET,         expira en 15m)
   - refresh_token (firmado con JWT_REFRESH_SECRET,  expira en 7d)
4. refresh_token se hashea con bcrypt y se guarda en users.refresh_token_hash
5. Cliente almacena ambos tokens

── Cada request autenticado ──
6. Cliente envía: Authorization: Bearer <access_token>
7. JwtStrategy extrae y verifica el token
8. Se inyecta el usuario en request.user

── Cuando el access_token expira ──
9.  Cliente → POST /auth/refresh  { refresh_token }
10. Servidor verifica la firma del refresh_token con JWT_REFRESH_SECRET
11. Servidor compara el token con el hash guardado (bcrypt.compare)
12. Servidor emite nuevos access_token y refresh_token (rotación)
```

### Control de Acceso Basado en Roles (RBAC)

El sistema implementa 3 roles con distintos niveles de acceso:

| Rol           | Puede hacer                                                                    |
|---------------|--------------------------------------------------------------------------------|
| `SUPER_ADMIN` | Todo. Acceso total al sistema. Bypasea todas las restricciones de rol.         |
| `VETERINARIO` | Gestionar mascotas, historial clínico y vacunas de su clínica; ver propietarios. |
| `PROPIETARIO` | Completar su perfil, ver sus propias mascotas e historial clínico.             |

**Implementación:** El decorador `@Roles(RoleName.VETERINARIO)` sobre un endpoint protegido hace que el `RolesGuard` verifique que el usuario autenticado tenga ese rol. Los usuarios `SUPER_ADMIN` siempre pasan este guard.

### Hash de Contraseñas

Las contraseñas se almacenan con **bcrypt** (factor de costo 10). Nunca se guardan en texto plano. Los campos `password_hash` y `refresh_token_hash` están decorados con `@Exclude` para que nunca aparezcan en las respuestas de la API.

---

## Estructura del Proyecto

```
veterinaria-api/
├── src/
│   ├── app.module.ts           # Módulo raíz, configuración de TypeORM y módulos
│   ├── main.ts                 # Bootstrap: ValidationPipe, Swagger, ClassSerializer
│   │
│   ├── auth/                   # Autenticación y autorización
│   │   ├── decorators/         # @CurrentUser, @Roles, @Public
│   │   ├── dto/                # LoginDto, RegisterDto, RefreshTokenDto, CreateVetDto
│   │   ├── entities/           # user.entity.ts, role.entity.ts
│   │   ├── guards/             # JwtAuthGuard, RolesGuard
│   │   ├── strategies/         # jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── clinics/                # Gestión de clínicas
│   │   ├── dto/                # CreateClinicDto, UpdateClinicDto
│   │   ├── entities/           # clinic.entity.ts
│   │   ├── clinics.controller.ts
│   │   ├── clinics.service.ts
│   │   └── clinics.module.ts
│   │
│   ├── users/                  # Gestión de veterinarios
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── pacientes/              # Propietarios y mascotas
│   │   ├── dto/                # CreateOwnerDto, CreatePetDto, UpdatePetDto
│   │   ├── entities/           # owner.entity.ts, pet.entity.ts
│   │   ├── owners.controller.ts
│   │   ├── pets.controller.ts
│   │   ├── owners.service.ts
│   │   ├── pets.service.ts
│   │   └── pacientes.module.ts
│   │
│   ├── historial/              # Historial clínico y tratamientos
│   │   ├── dto/                # CreateClinicalRecordDto, CreateTreatmentDto
│   │   ├── entities/           # clinical-record.entity.ts, treatment.entity.ts
│   │   ├── historial.controller.ts
│   │   ├── historial.service.ts
│   │   └── historial.module.ts
│   │
│   ├── vacunacion/             # Vacunas y alertas
│   │   ├── dto/                # CreateVaccineDto, UpdateVaccineDto
│   │   ├── entities/           # vaccine.entity.ts
│   │   ├── vacunacion.controller.ts
│   │   ├── vacunacion.service.ts
│   │   └── vacunacion.module.ts
│   │
│   └── seed/                   # Datos iniciales de prueba
│       ├── seed.service.ts
│       └── seed.module.ts
│
├── .env.example                # Plantilla de variables de entorno
├── .gitignore
├── docker-compose.yml          # PostgreSQL + API en contenedores
├── Dockerfile                  # Imagen Docker de la API
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## Scripts Disponibles

| Script               | Comando                  | Descripción                                          |
|----------------------|--------------------------|------------------------------------------------------|
| Desarrollo           | `npm run start:dev`      | Inicia con hot-reload (watch mode)                   |
| Debug                | `npm run start:debug`    | Inicia con inspector de Node.js habilitado           |
| Producción (build)   | `npm run build`          | Compila TypeScript a JavaScript en `dist/`           |
| Producción (run)     | `npm run start:prod`     | Ejecuta el build compilado (`node dist/main`)        |
| Desarrollo simple    | `npm run start`          | Inicia sin hot-reload                                |
| Linting              | `npm run lint`           | ESLint con auto-fix                                  |
| Formateo             | `npm run format`         | Prettier sobre todos los archivos `.ts`              |
| Tests unitarios      | `npm run test`           | Jest en modo single run                              |
| Tests (watch)        | `npm run test:watch`     | Jest en modo watch                                   |
| Cobertura            | `npm run test:cov`       | Jest con reporte de cobertura                        |
| Tests E2E            | `npm run test:e2e`       | Jest con configuración de tests end-to-end           |

---

## Documentación Swagger

La API incluye documentación interactiva generada automáticamente con **Swagger / OpenAPI**:

```
http://localhost:3000/api
```

Desde la interfaz Swagger es posible:
- Explorar todos los endpoints disponibles
- Autenticarse con un Bearer Token (botón "Authorize")
- Probar cada endpoint directamente desde el navegador
- Ver los esquemas de request y response de cada operación

Para autenticarse en Swagger:
1. Iniciar sesión en `POST /auth/login`
2. Copiar el `access_token` de la respuesta
3. Clicar "Authorize" en la esquina superior derecha
4. Pegar el token en el campo `Bearer Token`

---

## Frontend Relacionado

Este backend es consumido por la aplicación móvil desarrollada en Flutter:

> Repositorio: `veterinaria-app` (Flutter)

La app móvil se comunica con esta API mediante HTTP + Bearer Token y está diseñada para las plataformas Android e iOS. Es parte del mismo trabajo de grado en la Maestría en Desarrollo Full Stack — UCB 2026.

---

## Autor

**Harold Muyba Castro**
Maestría en Desarrollo Full Stack
Universidad Católica Boliviana "San Pablo" — UCB, 2026

Trabajo de Grado: *Sistema de gestión de clínicas veterinarias — Backend API REST*
