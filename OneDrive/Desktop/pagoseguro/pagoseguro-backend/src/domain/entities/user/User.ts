import { Email } from '../../value-objects/Email';
import { Password } from '../../value-objects/Password';

export enum UserRole {
  CLIENTE = 'CLIENTE',
  ASISTENTE = 'ASISTENTE',
  GERENTE = 'GERENTE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED',
}


export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    private _password: Password,
    public readonly fullName: string,
    public readonly role: UserRole,
    public status: UserStatus,
    public readonly cedula?: string,
    public readonly telefono?: string,
    public readonly direccion?: string,
    public loginAttempts: number = 0,
    public lastLoginAttempt?: Date,
    public blockedUntil?: Date,
    public lastLogin?: Date,
    public emailVerified: boolean = false,
    public emailVerifiedAt?: Date,
    public verificationToken?: string,
    public resetToken?: string,
    public resetTokenExpiry?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly createdBy?: string,
    public updatedAt: Date = new Date()
  ) {}

  /* =========================
     PASSWORD
  ========================== */

  getPassword(): Password {
    return this._password;
  }

  setPassword(password: Password): void {
    this._password = password;
    this.updatedAt = new Date();
  }

  async verifyPassword(plainPassword: string): Promise<boolean> {
    return this._password.compare(plainPassword);
  }

  /* =========================
     LOGIN / SECURITY
  ========================== */

  incrementLoginAttempts(): void {
    this.loginAttempts++;
    this.lastLoginAttempt = new Date();

    if (this.loginAttempts >= 5) {
      this.blockAccount(30);
    }
  }

  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lastLoginAttempt = undefined;
  }

  blockAccount(minutes: number): void {
    this.status = UserStatus.BLOCKED;
    this.blockedUntil = new Date(Date.now() + minutes * 60 * 1000);
  }

  isBlocked(): boolean {
    if (this.status !== UserStatus.BLOCKED) return false;
    if (!this.blockedUntil) return false;

    if (new Date() > this.blockedUntil) {
      this.status = UserStatus.ACTIVE;
      this.blockedUntil = undefined;
      this.resetLoginAttempts();
      return false;
    }

    return true;
  }

  updateLastLogin(): void {
    this.lastLogin = new Date();
    this.resetLoginAttempts();
  }

  /* =========================
     EMAIL VERIFICATION
  ========================== */

  verifyEmail(): void {
    this.emailVerified = true;
    this.emailVerifiedAt = new Date();
    this.verificationToken = undefined;
    this.status = UserStatus.ACTIVE;
  }

  generateVerificationToken(): string {
    this.verificationToken = crypto.randomUUID();
    return this.verificationToken;
  }

  /* =========================
     PASSWORD RESET
  ========================== */

  generateResetToken(): string {
    this.resetToken = crypto.randomUUID();
    this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return this.resetToken;
  }

  isResetTokenValid(token: string): boolean {
    if (!this.resetToken || !this.resetTokenExpiry) return false;
    if (this.resetToken !== token) return false;
    return new Date() < this.resetTokenExpiry;
  }
}
