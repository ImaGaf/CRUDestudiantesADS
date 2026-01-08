#!/bin/bash

# ============================================================================
# Script de Inicialización del Backend - PagoSeguroAGROTAC
# Arquitectura Hexagonal con Node.js + TypeScript + PostgreSQL
# ============================================================================

echo "🚀 Iniciando configuración del backend..."

# Crear directorio raíz del proyecto
mkdir pagoseguro-backend
cd pagoseguro-backend

# ============================================================================
# ESTRUCTURA DE CARPETAS COMPLETA
# ============================================================================

echo "📁 Creando estructura de carpetas..."

# Carpetas principales
mkdir -p src/{domain,application,infrastructure,shared}

# DOMAIN LAYER (Core del negocio)
mkdir -p src/domain/{entities,value-objects,repositories,services,exceptions,events,factories}

# Entities
mkdir -p src/domain/entities/{user,credit,payment,receipt}

# Value Objects
mkdir -p src/domain/value-objects

# Repositories (Interfaces/Ports)
mkdir -p src/domain/repositories

# Services (Interfaces/Ports para servicios externos)
mkdir -p src/domain/services

# Exceptions
mkdir -p src/domain/exceptions

# Events (Domain Events para arquitectura event-driven)
mkdir -p src/domain/events

# Factories (Factory Pattern)
mkdir -p src/domain/factories

# APPLICATION LAYER (Casos de uso)
mkdir -p src/application/{use-cases,dto,validators,mappers}

# Use Cases por módulo
mkdir -p src/application/use-cases/{auth,credits,payments,reports,notifications}

# DTOs (Data Transfer Objects)
mkdir -p src/application/dto/{auth,credits,payments,reports}

# Validators (Validaciones con Zod)
mkdir -p src/application/validators

# Mappers (Conversiones DTO <-> Entity)
mkdir -p src/application/mappers

# INFRASTRUCTURE LAYER (Adaptadores)
mkdir -p src/infrastructure/{adapters,http,database,config,logging}

# Adapters
mkdir -p src/infrastructure/adapters/{repositories,services,controllers,middleware}

# HTTP (Express setup)
mkdir -p src/infrastructure/http/{routes,middleware}

# Database
mkdir -p src/infrastructure/database/{migrations,seeds,prisma}

# Config
mkdir -p src/infrastructure/config

# Logging
mkdir -p src/infrastructure/logging

# SHARED (Código compartido)
mkdir -p src/shared/{types,utils,constants,errors}

# Tests
mkdir -p tests/{unit,integration,e2e}
mkdir -p tests/unit/{domain,application,infrastructure}
mkdir -p tests/integration/{use-cases,repositories}
mkdir -p tests/e2e/{auth,credits,payments}

# Documentación
mkdir -p docs/{api,architecture,deployment}

echo "✅ Estructura de carpetas creada"

# ============================================================================
# ARCHIVOS DE CONFIGURACIÓN
# ============================================================================

echo "📝 Creando archivos de configuración..."

# package.json
cat > package.json << 'EOF'
{
  "name": "pagoseguro-backend",
  "version": "1.0.0",
  "description": "Backend para PagoSeguroAGROTAC - Sistema de gestión de pagos y créditos",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/infrastructure/http/server.ts",
    "build": "tsc",
    "start": "node dist/infrastructure/http/server.js",
    "test": "jest --watchAll",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "jest --testPathPattern=tests/e2e --runInBand",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx src/infrastructure/database/seeds/index.ts",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  },
  "keywords": ["hexagonal", "ddd", "clean-architecture", "typescript", "express"],
  "author": "Grupo 3 - AGROTAC",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "express": "^4.18.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "express-rate-limit": "^7.1.5",
    "express-async-errors": "^3.1.1",
    "nodemailer": "^6.9.7",
    "@sendgrid/mail": "^8.1.0",
    "uuid": "^9.0.1",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.6",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/nodemailer": "^6.4.14",
    "@types/uuid": "^9.0.7",
    "@types/jest": "^29.5.11",
    "@types/supertest": "^6.0.2",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "prisma": "^5.22.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "supertest": "^6.3.3",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "@typescript-eslint/parser": "^6.16.0",
    "prettier": "^3.1.1",
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": ".",
    "paths": {
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@shared/*": ["src/shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# .env.example
cat > .env.example << 'EOF'
# ============================================================================
# CONFIGURACIÓN DE ENTORNO - PagoSeguroAGROTAC
# ============================================================================

# Entorno
NODE_ENV=development

# Servidor
PORT=3000
HOST=localhost
API_PREFIX=/api/v1

# Base de Datos (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/pagoseguro_db?schema=public"
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=pagoseguro_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123

# JWT (Autenticación)
JWT_SECRET=tu_super_secreto_jwt_cambiar_en_produccion_min_32_caracteres
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Bcrypt
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (SendGrid)
SENDGRID_API_KEY=SG.tu_api_key_aqui
EMAIL_FROM=notificaciones@elgranito.com
EMAIL_FROM_NAME=El Granito AGROTAC

# Pasarela de Pagos (Stripe)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Features Flags
ENABLE_EMAIL_VERIFICATION=true
ENABLE_MFA=false
ENABLE_OCR=false
EOF

# .env (copiar desde .env.example)
cp .env.example .env

# .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
*.lcov

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Database
*.db
*.sqlite
*.sqlite3

# Prisma
prisma/migrations/
!prisma/migrations/.gitkeep

# Temp
temp/
tmp/
*.tmp

# OS
Thumbs.db
EOF

# .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-floating-promises": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "env": {
    "node": true,
    "es2022": true
  }
}
EOF

# .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
EOF

# jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/infrastructure/http/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
};
EOF

# Docker Compose
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pagoseguro-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: pagoseguro_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./src/infrastructure/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - pagoseguro-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: pagoseguro-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/pagoseguro_db
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - pagoseguro-network
    command: npm run dev

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pagoseguro-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@agrotac.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - pagoseguro-network

volumes:
  postgres_data:

networks:
  pagoseguro-network:
    driver: bridge
EOF

# Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Producción
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
EOF

# .dockerignore
cat > .dockerignore << 'EOF'
node_modules
dist
.env
.env.*
.git
.gitignore
README.md
docker-compose.yml
Dockerfile
*.log
coverage
tests
EOF

# README.md
cat > README.md << 'EOF'
# PagoSeguroAGROTAC - Backend

Sistema de gestión de pagos y créditos para El Granito de AGROTAC.

## 🏗️ Arquitectura

Este proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)** con:

- **Domain Layer**: Entidades, Value Objects, Interfaces
- **Application Layer**: Casos de Uso, DTOs, Validadores
- **Infrastructure Layer**: Adaptadores (HTTP, DB, Servicios Externos)

## 🚀 Stack Tecnológico

- **Runtime**: Node.js 20 LTS
- **Lenguaje**: TypeScript 5.3
- **Framework HTTP**: Express.js 4.18
- **ORM**: Prisma 5.22
- **Base de Datos**: PostgreSQL 15
- **Autenticación**: JWT + bcrypt
- **Validación**: Zod
- **Testing**: Jest + Supertest
- **Logs**: Winston

## 📋 Prerequisitos

- Node.js >= 20.0.0
- PostgreSQL >= 15
- Docker & Docker Compose (opcional)

## ⚙️ Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd pagoseguro-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Levantar base de datos con Docker
npm run docker:up

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Sembrar datos iniciales
npm run prisma:seed
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Modo desarrollo con hot-reload

# Build
npm run build            # Compilar TypeScript
npm start                # Ejecutar versión compilada

# Testing
npm test                 # Tests en modo watch
npm run test:unit        # Solo tests unitarios
npm run test:integration # Tests de integración
npm run test:e2e         # Tests end-to-end
npm run test:coverage    # Cobertura de tests

# Linting
npm run lint             # Verificar código
npm run lint:fix         # Corregir automáticamente
npm run format           # Formatear con Prettier

# Base de Datos
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Sembrar datos

# Docker
npm run docker:up        # Levantar contenedores
npm run docker:down      # Detener contenedores
npm run docker:logs      # Ver logs
```

## 📁 Estructura del Proyecto

```
src/
├── domain/              # Lógica de negocio pura
├── application/         # Casos de uso
├── infrastructure/      # Adaptadores
└── shared/              # Código compartido
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (rounds=12)
- Autenticación JWT con refresh tokens
- Rate limiting habilitado
- Headers de seguridad con Helmet
- Validación estricta con Zod
- SQL injection prevention con Prisma

## 📚 Documentación API

La documentación Swagger está disponible en: `http://localhost:3000/api/docs`

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Con cobertura
npm run test:coverage
```

## 📝 Licencia

MIT - Grupo 3 AGROTAC
EOF

echo "✅ Archivos de configuración creados"

# ============================================================================
# CREAR ARCHIVOS INICIALES
# ============================================================================

echo "📄 Creando archivos base..."

# src/index.ts
cat > src/index.ts << 'EOF'
import { app } from './infrastructure/http/app';
import { config } from './infrastructure/config/env';
import { logger } from './infrastructure/logging/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📍 URL: ${config.backendUrl}`);
  logger.info(`🔧 Entorno: ${config.nodeEnv}`);
});
EOF

# Crear archivos .gitkeep para carpetas vacías
find src tests docs -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Archivos base creados"

# ============================================================================
# INSTRUCCIONES FINALES
# ============================================================================

echo ""
echo "================================================================"
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "================================================================"
echo ""
echo "📦 Próximos pasos:"
echo ""
echo "1️⃣  Instalar dependencias:"
echo "   npm install"
echo ""
echo "2️⃣  Configurar variables de entorno:"
echo "   Editar el archivo .env con tus credenciales"
echo ""
echo "3️⃣  Levantar PostgreSQL con Docker:"
echo "   npm run docker:up"
echo ""
echo "4️⃣  Configurar Prisma (próximo paso)"
echo ""
echo "================================================================"
EOF
