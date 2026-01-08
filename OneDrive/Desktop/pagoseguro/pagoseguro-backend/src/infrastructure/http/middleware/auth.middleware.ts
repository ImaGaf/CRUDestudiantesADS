import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../domain/services/ITokenService';
import { UserRole } from '../../../domain/entities/user/User';

export class AuthMiddleware {
  constructor(private readonly tokenService: ITokenService) {}

  authenticate() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.status(401).json({
            success: false,
            message: 'Token no proporcionado',
          });
          return;
        }

        const token = authHeader.substring(7);
        const payload = await this.tokenService.verifyAccessToken(token);

        (req as any).user = payload;
        next();
      } catch (error) {
        res.status(401).json({
          success: false,
          message: 'Token inválido o expirado',
        });
      }
    };
  }

  authorize(allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      if (!allowedRoles.includes(user.role as UserRole)) {
        res.status(403).json({
          success: false,
          message: 'No tiene permisos para acceder a este recurso',
        });
        return;
      }

      next();
    };
  }
}
