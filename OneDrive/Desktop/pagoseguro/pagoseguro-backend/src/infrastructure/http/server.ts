import { PrismaClient } from '@prisma/client';
import { config } from '../config/env';
import { createApp } from './app';

import { PostgresUserRepository } from '../adapters/repositories/PostgresUserRepository';
import { PostgresRefreshTokenRepository } from '../adapters/repositories/PostgresRefreshTokenRepository';
import { PostgresAuditLogRepository } from '../adapters/repositories/PostgresAuditLogRepository';

import { JWTTokenService } from '../adapters/services/JWTTokenService';
import { SendGridEmailService } from '../adapters/services/SendGridEmailService';
import { BcryptHashingService } from '../adapters/services/BcryptHashingService';

import { RegisterClientUseCase } from '../../application/use-cases/auth/RegisterClient.usecase';
import { LoginUseCase } from '../../application/use-cases/auth/Login.usecase';
import { RecoverPasswordUseCase } from '../../application/use-cases/auth/RecoverPassword.usecase';
import { LogoutUseCase } from '../../application/use-cases/auth/Logout.usecase';

import { AuthController } from './controllers/AuthController';
import { AuthMiddleware } from './middleware/auth.middleware';
import { createAuthRoutes } from './routes/auth.routes';


const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});


prisma.$connect()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida');
  })
  .catch((error: unknown) => {
    console.error('❌ Error al conectar con PostgreSQL:', error);
    process.exit(1);
  });

const userRepository = new PostgresUserRepository(prisma);
const refreshTokenRepository = new PostgresRefreshTokenRepository(prisma);
const auditLogRepository = new PostgresAuditLogRepository(prisma);

const tokenService = new JWTTokenService();
const emailService = new SendGridEmailService();
const hashingService = new BcryptHashingService();

const registerClientUseCase = new RegisterClientUseCase(
  userRepository,
  auditLogRepository,
  emailService
);

const loginUseCase = new LoginUseCase(
  userRepository,
  refreshTokenRepository,
  auditLogRepository,
  tokenService,
  emailService
);

const recoverPasswordUseCase = new RecoverPasswordUseCase(
  userRepository,
  auditLogRepository,
  emailService,
  tokenService
);

const logoutUseCase = new LogoutUseCase(
  refreshTokenRepository,
  auditLogRepository
);

const authController = new AuthController(
  registerClientUseCase,
  loginUseCase,
  recoverPasswordUseCase,
  logoutUseCase
);

const authMiddleware = new AuthMiddleware(tokenService);
const authRoutes = createAuthRoutes(authController, authMiddleware);
const app = createApp(authRoutes);

const PORT = config.port;
const HOST = config.host;

// Manejo de señales para graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM recibido, cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT recibido, cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('================================================================');
  console.log('🚀 Servidor PagoSeguroAGROTAC iniciado correctamente');
  console.log('================================================================');
  console.log(`📍 URL: ${config.backendUrl}`);
  console.log(`🔧 Entorno: ${config.nodeEnv}`);
  console.log(`⚡ Puerto: ${PORT}`);
  console.log(`🌐 Host: ${HOST}`);
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log('   POST /api/v1/auth/register           - Registrar cliente');
  console.log('   POST /api/v1/auth/login              - Iniciar sesión');
  console.log('   POST /api/v1/auth/recover-password   - Recuperar contraseña');
  console.log('   POST /api/v1/auth/logout             - Cerrar sesión');
  console.log('   GET  /health                         - Health check');
  console.log('');
  console.log('================================================================');
  console.log('');
});

export { app, prisma };