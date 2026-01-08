import { Request, Response } from 'express';
import { RegisterClientUseCase } from '../../../application/use-cases/auth/RegisterClient.usecase';
import { LoginUseCase } from '../../../application/use-cases/auth/Login.usecase';
import { RecoverPasswordUseCase } from '../../../application/use-cases/auth/RecoverPassword.usecase';
import { LogoutUseCase } from '../../../application/use-cases/auth/Logout.usecase';
import { registerClientSchema, loginSchema, recoverPasswordSchema } from '../../../application/validators/auth.validator';

export class AuthController {
  constructor(
    private readonly registerClientUseCase: RegisterClientUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerClientSchema.parse(req.body);

      const result = await this.registerClientUseCase.execute({
        ...validatedData,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.errors,
        });
        return;
      }

      if (error.name === 'UserAlreadyExistsException') {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }

      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validar datos de entrada
      const validatedData = loginSchema.parse(req.body);

      // Ejecutar caso de uso
      const result = await this.loginUseCase.execute({
        ...validatedData,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      // Establecer cookie con refresh token
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });

      res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.errors,
        });
        return;
      }

      if (error.name === 'InvalidCredentialsException' || error.name === 'UserNotFoundException') {
        res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas',
        });
        return;
      }

      if (error.name === 'DomainException') {
        res.status(403).json({
          success: false,
          message: error.message,
        });
        return;
      }

      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  async recoverPassword(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = recoverPasswordSchema.parse(req.body);

      const result = await this.recoverPasswordUseCase.execute({
        ...validatedData,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      res.status(200).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.errors,
        });
        return;
      }

      console.error('Error en recuperación de contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      const userId = (req as any).user?.userId;

      if (!refreshToken || !userId) {
        res.status(400).json({
          success: false,
          message: 'Datos insuficientes para cerrar sesión',
        });
        return;
      }

      await this.logoutUseCase.execute({
        userId,
        refreshToken,
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      res.clearCookie('refreshToken');
      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }
}
