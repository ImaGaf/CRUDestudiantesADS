import { User } from '../entities/user/User';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByCedula(cedula: string): Promise<boolean>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}