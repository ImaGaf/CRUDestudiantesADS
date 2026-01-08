import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';

export interface LogoutDTO {
  userId: string;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
}

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly auditLogRepository: IAuditLogRepository
  ) {}

  async execute(dto: LogoutDTO): Promise<void> {
    // 1. Eliminar refresh token
    await this.refreshTokenRepository.deleteByToken(dto.refreshToken);

    // 2. Registrar en auditoría
    await this.auditLogRepository.save({
      userId: dto.userId,
      action: 'user.logout',
      module: 'AUTH',
      details: {},
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      status: 'SUCCESS',
    });
  }
}
