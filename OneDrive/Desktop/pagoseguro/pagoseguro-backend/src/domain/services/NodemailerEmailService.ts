import nodemailer from 'nodemailer';
import { IEmailService } from '../../domain/services/IEmailService';

export class NodemailerEmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async sendMail(to: string, subject: string, html: string, text?: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const link = `https://tu-dominio.com/verify?token=${token}`;

    await this.sendMail(
      email,
      'Verifica tu cuenta',
      `
      <h2>Hola ${name}</h2>
      <p>Gracias por registrarte.</p>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${link}">${link}</a>
      `
    );
  }

  async sendPasswordResetEmail(email: string, code: string, name: string): Promise<void> {
    await this.sendMail(
      email,
      'Recuperación de contraseña',
      `
      <h2>Hola ${name}</h2>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p><strong>Código de recuperación:</strong></p>
      <h1>${code}</h1>
      <p>Si no solicitaste esto, ignora este correo.</p>
      `,
      `Tu código de recuperación es: ${code}`
    );
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendMail(
      email,
      'Bienvenido a PagoSeguro AGROTAC',
      `
      <h2>Bienvenido ${name}</h2>
      <p>Tu cuenta ha sido creada exitosamente.</p>
      `
    );
  }

  async sendAccountBlockedEmail(email: string, name: string, blockedUntil: Date): Promise<void> {
    await this.sendMail(
      email,
      'Cuenta bloqueada',
      `
      <h2>Hola ${name}</h2>
      <p>Tu cuenta ha sido bloqueada temporalmente.</p>
      <p>Bloqueo hasta: ${blockedUntil.toLocaleString()}</p>
      `
    );
  }
}
