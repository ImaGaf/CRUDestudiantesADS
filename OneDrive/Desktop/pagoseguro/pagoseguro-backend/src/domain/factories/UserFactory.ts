import { User, UserRole, UserStatus } from '../entities/user/User';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

export class UserFactory {

  static async createNew(props: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    cedula?: string;
    telefono?: string;
    direccion?: string;
    createdBy?: string;
  }): Promise<User> {

    const email = Email.create(props.email);

    const plainPassword = Password.create(props.password);
    const hashedPasswordString = await plainPassword.hash();
    const hashedPassword = Password.fromHash(hashedPasswordString);

    return new User(
      crypto.randomUUID(),
      email,
      hashedPassword,
      props.fullName,
      props.role,
      UserStatus.PENDING_VERIFICATION,
      props.cedula,
      props.telefono,
      props.direccion,
      0,
      undefined,
      undefined,
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      new Date(),
      props.createdBy
    );
  }

  static reconstitute(props: {
    id: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    cedula?: string;
    telefono?: string;
    direccion?: string;
    loginAttempts: number;
    lastLoginAttempt?: Date;
    blockedUntil?: Date;
    lastLogin?: Date;
    emailVerified: boolean;
    emailVerifiedAt?: Date;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    createdAt: Date;
    createdBy?: string;
    updatedAt: Date;
  }): User {
    return new User(
      props.id,
      Email.create(props.email),
      Password.fromHash(props.password),
      props.fullName,
      props.role,
      props.status,
      props.cedula,
      props.telefono,
      props.direccion,
      props.loginAttempts,
      props.lastLoginAttempt,
      props.blockedUntil,
      props.lastLogin,
      props.emailVerified,
      props.emailVerifiedAt,
      props.verificationToken,
      props.resetToken,
      props.resetTokenExpiry,
      props.createdAt,
      props.createdBy,
      props.updatedAt
    );
  }
}
