import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '../../../domain/repositories/IRefreshTokenRepository';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';
import { ITokenService } from '../../../domain/services/ITokenService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { InvalidCredentialsException } from '../../../domain/exceptions/InvalidCredentialsException';
import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException';
import { DomainException } from '../../../domain/exceptions/DomainException';

export interface LoginDTO {
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}

export interface LoginResult {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResult> {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findByEmail(dto.email);
    
    if (!user) {
      await this.logAudit('user.login', 'FAILURE', dto, 'Usuario no encontrado');
      throw new UserNotFoundException();
    }

    // 2. Verificar si está bloqueado
    if (user.isBlocked()) {
      await this.logAudit('user.login', 'FAILURE', dto, 'Cuenta bloqueada', user.id);
      throw new DomainException(
        `Cuenta bloqueada hasta ${user.blockedUntil?.toLocaleString()}`
      );
    }

    // 3. Verificar contraseña
    const isPasswordValid = await user.verifyPassword(dto.password);
    
    if (!isPasswordValid) {
      user.incrementLoginAttempts();
      await this.userRepository.update(user);
      
      if (user.isBlocked()) {
        await this.emailService.sendAccountBlockedEmail(
          user.email.value,
          user.fullName,
          user.blockedUntil!
        );
      }
      
      await this.logAudit('user.login', 'FAILURE', dto, 'Contraseña incorrecta', user.id);
      throw new InvalidCredentialsException();
    }

    // 4. Verificar estado de la cuenta
    //if (user.status === UserStatus.PENDING_VERIFICATION) {
      //await this.logAudit('user.login', 'FAILURE', dto, 'Email no verificado', user.id);
      //throw new DomainException('Debe verificar su email antes de iniciar sesión');
    //}

    //if (user.status === UserStatus.INACTIVE) {
      //await this.logAudit('user.login', 'FAILURE', dto, 'Cuenta inactiva', user.id);
      //throw new DomainException('Su cuenta está inactiva. Contacte al administrador');
    //}

    // 5. Actualizar último login y resetear intentos
    user.updateLastLogin();
    await this.userRepository.update(user);

    // 6. Generar tokens
    const tokens = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email.value,
      role: user.role,
    });

    // 7. Guardar refresh token
    await this.refreshTokenRepository.save({
      id: crypto.randomUUID(),
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      createdAt: new Date(),
    });

    // 8. Registrar en auditoría
    await this.logAudit('user.login', 'SUCCESS', dto, undefined, user.id);

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email.value,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  private async logAudit(
    action: string,
    status: 'SUCCESS' | 'FAILURE',
    dto: LoginDTO,
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
