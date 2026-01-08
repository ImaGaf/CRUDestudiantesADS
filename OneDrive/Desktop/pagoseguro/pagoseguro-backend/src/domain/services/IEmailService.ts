export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailService {
  sendVerificationEmail(email: string, token: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, code: string, name: string): Promise<void>;
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendAccountBlockedEmail(email: string, name: string, blockedUntil: Date): Promise<void>;
}