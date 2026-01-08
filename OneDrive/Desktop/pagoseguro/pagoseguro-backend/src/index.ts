import { app } from './infrastructure/http/app';
import { config } from './infrastructure/config/env';
import { logger } from './infrastructure/logging/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📍 URL: ${config.backendUrl}`);
  logger.info(`🔧 Entorno: ${config.nodeEnv}`);
});
