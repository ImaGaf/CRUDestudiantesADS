import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload, Tokens } from '../../../domain/services/ITokenService';
import { config } from '../../config/env';

export class JWTTokenService implements ITokenService {
  async generateTokens(payload: TokenPayload): Promise<Tokens> {
    const secret = config.jwt.secret;
    
    if (!secret) {
      throw new Error('JWT secret no está configurado');
    }

    const secretBuffer = Buffer.from(secret);

    const accessToken = jwt.sign(
      payload, 
      secretBuffer, 
      {
        expiresIn: config.jwt.accessTokenExpiration,
      }
    ) as string;

    const refreshToken = jwt.sign(
      payload, 
      secretBuffer, 
      {
        expiresIn: config.jwt.refreshTokenExpiration,
      }
    ) as string;

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const secret = config.jwt.secret;
      
      if (!secret) {
        throw new Error('JWT secret no está configurado');
      }

      const secretBuffer = Buffer.from(secret);
      const decoded = jwt.verify(token, secretBuffer) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const secret = config.jwt.secret;
      
      if (!secret) {
        throw new Error('JWT secret no está configurado');
      }

      const secretBuffer = Buffer.from(secret);
      const decoded = jwt.verify(token, secretBuffer) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Refresh token inválido o expirado');
    }
  }

  generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}