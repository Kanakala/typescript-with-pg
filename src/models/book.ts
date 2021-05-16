import { IsDate, IsUUID } from 'class-validator';

export class Book {
  @IsUUID(4) // Version 4
  id: string;

  title: string;

  content?: string | null;

  author?: string | null;

  publicationYear?: number | null;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
