import { PrismaClient } from '@prisma/client';
import { 
  IAuditLogRepository, 
  AuditLogData 
} from '../../../domain/repositories/IAuditLogRepository';

export class PostgresAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(log: AuditLogData): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        id: log.id || crypto.randomUUID(),
        userId: log.userId,
        action: log.action,
        module: log.module,
        details: log.details || {},
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        status: log.status,
        createdAt: log.createdAt || new Date(),
      },
    });
  }

  async findByUserId(userId: string, limit: number = 50): Promise<AuditLogData[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log: typeof logs[number]) => ({
      id: log.id,
      userId: log.userId || undefined,
      action: log.action,
      module: log.module,
      details: log.details as Record<string, any>,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      status: log.status as 'SUCCESS' | 'FAILURE' | 'WARNING',
      createdAt: log.createdAt,
    }));
  }

  async findByAction(action: string, limit: number = 50): Promise<AuditLogData[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log: typeof logs[number]) => ({
      id: log.id,
      userId: log.userId || undefined,
      action: log.action,
      module: log.module,
      details: log.details as Record<string, any>,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      status: log.status as 'SUCCESS' | 'FAILURE' | 'WARNING',
      createdAt: log.createdAt,
    }));
  }

  async findRecent(limit: number = 100): Promise<AuditLogData[]> {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs.map((log: typeof logs[number]) => ({
      id: log.id,
      userId: log.userId || undefined,
      action: log.action,
      module: log.module,
      details: log.details as Record<string, any>,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      status: log.status as 'SUCCESS' | 'FAILURE' | 'WARNING',
      createdAt: log.createdAt,
    }));
  }
}
