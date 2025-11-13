# Usa la imagen oficial de Bun
FROM oven/bun:1.2.19-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json bun.lockb* ./

# Instalar dependencias
RUN bun install --frozen-lockfile

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production

# Comando para iniciar la aplicación directamente con Bun
CMD ["bun", "run", "src/main.ts"]