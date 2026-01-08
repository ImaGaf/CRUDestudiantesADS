export interface RefreshTokenData {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IRefreshTokenRepository {
  save(token: RefreshTokenData): Promise<void>;
  findByToken(token: string): Promise<RefreshTokenData | null>;
  deleteByUserId(userId: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteExpired(): Promise<void>;
}