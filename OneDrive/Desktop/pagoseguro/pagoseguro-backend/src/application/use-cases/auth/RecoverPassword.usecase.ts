import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { ITokenService } from '../../../domain/services/ITokenService';


export interface RecoverPasswordDTO {
  email: string;
  ipAddress: string;
  userAgent: string;
}

export interface RecoverPasswordResult {
  success: boolean;
  message: string;
}

export class RecoverPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly emailService: IEmailService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: RecoverPasswordDTO): Promise<RecoverPasswordResult> {
    // 1. Buscar usuario
    const user = await this.userRepository.findByEmail(dto.email);
    
    // Mensaje genérico para evitar enumeración de usuarios
    const genericMessage = 'Si existe una cuenta asociada, recibirá un correo con instrucciones';
    
    if (!user) {
      await this.logAudit('user.password_recovery', 'FAILURE', dto, 'Usuario no encontrado');
      return {
        success: true,
        message: genericMessage,
      };
    }

    // 2. Generar código de recuperación
    const resetCode = this.tokenService.generateResetCode();
    user.generateResetToken();
    
    // 3. Actualizar usuario
    await this.userRepository.update(user);

    // 4. Enviar email
    try {
      await this.emailService.sendPasswordResetEmail(
        dto.email,
        resetCode,
        user.fullName
      );
    } catch (error) {
      console.error('Error enviando email de recuperación:', error);
      await this.logAudit('user.password_recovery', 'FAILURE', dto, 'Error enviando email', user.id);
    }

    // 5. Registrar en auditoría
    await this.logAudit('user.password_recovery', 'SUCCESS', dto, undefined, user.id);

    return {
      success: true,
      message: genericMessage,
    };
  }

  private async logAudit(
    action: string,
    status: 'SUCCESS' | 'FAILURE',
    dto: RecoverPasswordDTO,
    error?: string,
    userId?: string
  ): Promise<void> {
    await this.auditLogRepository.save({
      userId,
      action,
      module: 'AUTH',
      details: {
        email: dto.email,
        error,
      },
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      status,
    });
  }
}