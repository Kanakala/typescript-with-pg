import { IsEmail, IsEnum, IsDate, IsUUID } from 'class-validator';
import { Book } from './book';

export enum UserRole {
  'ADMIN' = 'ADMIN',
  'SUBSCRIBER' = 'SUBSCRIBER',
}

export class User {
  @IsUUID(4) // Version 4
  id: string;

  firstName: string;

  lastName?: string | null;

  password: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  books?: Book[];
}
