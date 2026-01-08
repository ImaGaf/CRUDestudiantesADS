import bcrypt from 'bcrypt';
import { DomainException } from '../exceptions/DomainException';

export class Password {
  private constructor(
    private readonly value: string,
    private readonly isHashed: boolean = false
  ) {}

  static create(plainPassword: string): Password {
    if (!this.isValid(plainPassword)) {
      throw new DomainException(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
      );
    }
    
    return new Password(plainPassword, false);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword, true);
  }

  private static isValid(password: string): boolean {
    if (password.length < 8) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  }

  async hash(): Promise<string> {
    if (this.isHashed) return this.value;
    
    //Strategy de hashing
    const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(this.value, rounds);
  }


  //Strategy de comparacion
  async compare(plainPassword: string): Promise<boolean> {
    if (!this.isHashed) {
      throw new DomainException('Cannot compare unhashed password');
    }
    
    return bcrypt.compare(plainPassword, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
