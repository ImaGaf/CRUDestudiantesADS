import { DomainException } from '../exceptions/DomainException';

export class Email {
  private constructor(public readonly value: string) {}

  // Factory Method con validación  
  static create(email: string): Email {
    const normalized = email.toLowerCase().trim();
    
    if (!this.isValid(normalized)) {
      throw new DomainException('Email inválido');
    }
    
    return new Email(normalized);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}