FROM oven/bun:1.1-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY tsconfig.json ./

RUN bun install
RUN bun add @nestjs/cli

COPY . .

EXPOSE 3000
