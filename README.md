---------------------------------------------------------------------------------
# BackIdeaProSAS
---------------------------------------------------------------------------------
front y back 
cloudflared tunnel --url http://localhost:5432
cloudflared tunnel --url http://localhost:3000

BACKIDEAPROSAS - Backend Sistema PQRSD

---------------------------------------------------------------------------------
# Descripción del proyecto
---------------------------------------------------------------------------------
Backend desarrollado en NestJS para un sistema de PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias). Proporciona una API RESTful con autenticación JWT, gestión de usuarios, chat en tiempo real y módulo completo para manejo de PQRSD.

---------------------------------------------------------------------------------
# Tecnologías y Librerías Utilizadas
---------------------------------------------------------------------------------
Dependencias Principales:

@nestjs/* - Framework principal y módulos

typeorm - ORM para base de datos

pg - Driver PostgreSQL

bcryptjs - Encriptación de contraseñas

passport-jwt - Autenticación JWT

@nestjs/websockets - Comunicación en tiempo real

@nestjs/swagger - Documentación de API

class-validator - Validación de DTOs

rxjs - Programación reactiva

Desarrollo:

typescript - Lenguaje de programación

bun - Runtime y package manager

tsx - Ejecución de TypeScript

---------------------------------------------------------------------------------
#  Estructura del proyecto
---------------------------------------------------------------------------------

text
BACKIDEAPROSAS/
├── src/
│   ├── entities/          # Entidades de TypeORM
│   ├── modules/          # Módulos de la aplicación
│   │   ├── assignments/  # Asignaciones
│   │   ├── auth/         # Autenticación
│   │   ├── chat/         # Chat en tiempo real
│   │   ├── dependence/   # Dependencias
│   │   ├── health/       # Health checks
│   │   ├── pqr/          # Módulo PQRSD
│   │   ├── seeder/       # Datos iniciales
│   │   └── users/        # Gestión de usuarios
│   ├── app.module.ts     # Módulo principal
│   └── main.ts          # Punto de entrada
├── dist/                # Código compilado
├── logs/               # Archivos de log
├── node_modules/       # Dependencias
├── .env               # Variables de entorno
├── package.json       # Configuración del proyecto
└── tsconfig.json     # Configuración TypeScript

---------------------------------------------------------------------------------
#  Explicación de las carpetas
---------------------------------------------------------------------------------
>entities/
Contiene las entidades de TypeORM que representan las tablas de la base de datos. Cada entidad define la estructura de datos y relaciones entre tablas.

> modules/
Sistema modular de NestJS donde cada carpeta representa un módulo funcional:

>auth/: 
Maneja autenticación JWT, login, registro y renovación de tokens

>users/: 
Gestión de usuarios (CRUD, perfiles, permisos)

>pqr/: 
Núcleo del sistema PQRSD (creación, seguimiento, estados)

>chat/: 
Comunicación en tiempo real usando WebSockets

>assignments/:
 Asignación de PQRS a usuarios

>dependence/:
 Gestión de dependencias organizacionales

>health/:
 Endpoints de monitoreo y health checks

>src/app.module.ts
Módulo raíz que importa y configura todos los módulos de la aplicación, middleware global y providers.

>src/main.ts
Punto de entrada de la aplicación, configura el servidor Express, Swagger y puerto.

---------------------------------------------------------------------------------
#  Configuración y entorno
---------------------------------------------------------------------------------

Variables de entorno (.env):
env
APP_PORT=3000                    # Puerto de la aplicación
JWT_SECRET=please_change_me      # Clave para JWT (CAMBIAR en producción)
JWT_EXPIRES=7d                   # Expiración de tokens
DATABASE_URL=postgresql://...    # URL de conexión PostgreSQL
ADMIN_EMAIL=admin@example.com    # Email admin inicial
ADMIN_PASSWORD=ChangeMe123!      # Password admin inicial
Base de Datos:
Motor: PostgreSQL

Conexión: Via URL de conexión (Supabase)

ORM: TypeORM con decoradores

Migraciones: Auto-sincronización en desarrollo

# Como ejecutar el proyecto
Entorno de Desarrollo:
Clonar y configurar:

bash
git clone <repository-url>
cd BACKIDEAPROSAS
cp .env.sample .env
# Editar .env con tus configuraciones
Instalar dependencias:

bash
bun install
Ejecutar en desarrollo:

bash
bun run dev
# o
bun run start:dev
Acceder a la aplicación:

API: http://localhost:3000

Swagger Docs: http://localhost:3000/api

---------------------------------------------------------------------------------
# Producción:
---------------------------------------------------------------------------------

Compilar proyecto:

bash
bun run build
Ejecutar producción:

bash
bun run start

---------------------------------------------------------------------------------
# Advertencias importantes:
---------------------------------------------------------------------------------
Cambiar JWT_SECRET en producción

Revisar credenciales de base de datos

El usuario admin se crea automáticamente con los datos de .env

---------------------------------------------------------------------------------
# Endpoints disponibles
---------------------------------------------------------------------------------

Autenticación:
Feature	Route	Method	Description
Login	/auth/login	POST	Autenticación de usuarios
Registro	/auth/register	POST	Creación de nuevos usuarios
Perfil	/auth/profile	GET	Información del usuario logueado
Usuarios:
Feature	Route	Method	Description
Listar usuarios	/users	GET	Lista todos los usuarios
Crear usuario	/users	POST	Crea nuevo usuario
Actualizar usuario	/users/:id	PUT	Actualiza usuario
Eliminar usuario	/users/:id	DELETE	Elimina usuario
PQRSD:
Feature	Route	Method	Description
Crear PQRS	/pqr	POST	Crea nueva PQRS
Listar PQRS	/pqr	GET	Lista todas las PQRS
Buscar PQRS	/pqr/:id	GET	Obtiene PQRS específica
Actualizar PQRS	/pqr/:id	PUT	Actualiza PQRS
Seguimiento	/pqr/:id/tracking	GET	Historial de seguimiento
Chat:
Feature	Route	Method	Description
WebSocket	/chat	WS	Conexión WebSocket para chat
Mensajes	/chat/messages	GET	Historial de mensajes

---------------------------------------------------------------------------------
# Arquitectura del proyecto
---------------------------------------------------------------------------------


text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                                Controllers   │───▶│    Services     │───▶│  Repositories   │
│                                  (@Controller) │    │   (@Injectable) │    │   (TypeORM)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
                       ▼                          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                                Routes      │    │  Business Logic │    │   Data Access   │
│                           HTTP/WebSocket│    │  Validation     │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
Patrones utilizados:
Módular: Cada funcionalidad en módulos separados

Inyección de Dependencias: Gestión automática de dependencias

Repository Pattern: Abstracción del acceso a datos

DTO Pattern: Transferencia de datos validada

JWT Authentication: Autenticación stateless

WebSockets: Comunicación bidireccional en tiempo real

Flujo de datos:
text
Cliente → Controlador → Servicio → Repositorio → Base de Datos
    ↓        ↓           ↓           ↓
  JWT     Validación  Lógica de  Operaciones
Auth     DTOs        Negocio    DB

---------------------------------------------------------------------------------
# Soporte
---------------------------------------------------------------------------------
Para issues y soporte técnico, contactar al equipo de desarrollo o crear un issue en el repositorio del proyecto.
