
import { UserRole } from '../../../domain/entities/user/User';
import { UserFactory } from '../../../domain/factories/UserFactory';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { UserAlreadyExistsException } from '../../../domain/exceptions/UserAlreadyExistsException';


export interface RegisterClientDTO {
  email: string;
  password: string;
  fullName: string;
  cedula: string;
  telefono: string;
  direccion: string;
  ipAddress: string;
  userAgent: string;
}

export interface RegisterClientResult {
  success: boolean;
  userId: string;
  message: string;
}

/* =========================
   USE CASE
========================== */

export class RegisterClientUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(
    dto: RegisterClientDTO
  ): Promise<RegisterClientResult> {

    // 1. Validaciones
    if (await this.userRepository.existsByEmail(dto.email)) {
      await this.logAudit('user.register', 'FAILURE', dto, 'Email ya registrado');
      throw new UserAlreadyExistsException(dto.email);
    }

    if (await this.userRepository.existsByCedula(dto.cedula)) {
      await this.logAudit('user.register', 'FAILURE', dto, 'Cédula ya registrada');
      throw new UserAlreadyExistsException(dto.cedula);
    }

    // 2. Crear usuario
    const user = await UserFactory.createNew({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      role: UserRole.CLIENTE,
      cedula: dto.cedula,
      telefono: dto.telefono,
      direccion: dto.direccion,
    });

    // 3. Token
    const verificationToken = user.generateVerificationToken();

    // 4. Persistir
    await this.userRepository.save(user);

    // 5. Email
    try {
      await this.emailService.sendVerificationEmail(
        dto.email,
        verificationToken,
        dto.fullName
      );
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
    }

    // 6. Auditoría
    await this.logAudit('user.register', 'SUCCESS', dto, undefined, user.id);

    return {
      success: true,
      userId: user.id,
      message: 'Cuenta creada exitosamente. Revise su correo para verificar su cuenta.',
    };
  }

  private async logAudit(
    action: string,
    status: 'SUCCESS' | 'FAILURE',
    dto: RegisterClientDTO,
    error?: string,
    userId?: string
  ): Promise<void> {
    await this.auditLogRepository.save({
      userId,
      action,
      module: 'AUTH',
      details: {
        email: dto.email,
        fullName: dto.fullName,
        error,
      },
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      status,
    });
  }
}
