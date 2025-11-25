# Fast Tutorial de BackIdeaProSAS

## BackIdeaProSAS

front y back
cloudflared tunnel --url http://localhost:5432/
cloudflared tunnel --url http://localhost:3000/

## Limpiar todo

docker compose down
docker system prune -f
docker compose build --no-cache
docker compose up

## Ejecutar

docker compose up

# Descripción del Proyecto

BackIdeaProSAS es una aplicación que combina un frontend y un backend para proporcionar una solución integral. Utiliza `cloudflared` para exponer servicios locales y `Docker` para la gestión de contenedores.

# Guía de Inicio Dev Mode

Base de datos en posgres en supabase
Ejecutar en local con bun

# ejecucion local

bun run dev

# Arquitecura de carpetas

## Arquitectura de Carpetas

La estructura de carpetas del proyecto es la siguiente:

```
 bun.lock
 dist
 docker-compose.yml
 Dockerfile
 logs
 node_modules
 package.json
 README.md
󱧼 src
     app.module.ts
     entities
         assignment.entity.ts
         chat-group.entity.ts
         dependence.entity.ts
         message.entity.ts
         pqr-ticket.entity.ts
         role.entity.ts
         user.entity.ts
     main.ts
     modules
     routes
 tsconfig.json
```

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de comenzar:

- Docker y Docker Compose
- Cloudflared

## Configuración Inicial

1. Clona este repositorio:

   ```bash
   git clone
   cd BackIdeaProSAS
   ```

````

2. Construye los contenedores:
   ```bash
   docker compose build
   ```

## Comandos Útiles

### Exponer Servicios Locales

- Exponer el backend:
  ```bash
  cloudflared tunnel --url http://localhost:5432/
  ```
- Exponer el frontend:
  ```bash
  cloudflared tunnel --url http://localhost:3000/
  ```

### Limpiar y Reconstruir

Para limpiar y reconstruir los contenedores:

```bash
docker compose down
docker system prune -f
docker compose build --no-cache
docker compose up
```

### Ejecutar la Aplicación

Para iniciar la aplicación:

```bash
docker compose up
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un fork del repositorio y envía un pull request con tus cambios.

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
````
