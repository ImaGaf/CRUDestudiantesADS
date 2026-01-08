export interface AuditLogData {
  id?: string;
  userId?: string;
  action: string;
  module: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  createdAt?: Date;
}

export interface IAuditLogRepository {
  save(log: AuditLogData): Promise<void>;
  findByUserId(userId: string, limit?: number): Promise<AuditLogData[]>;
  findByAction(action: string, limit?: number): Promise<AuditLogData[]>;
  findRecent(limit?: number): Promise<AuditLogData[]>;
}