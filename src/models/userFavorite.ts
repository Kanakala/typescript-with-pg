import { IsDate, IsUUID } from 'class-validator';

export class UserFavorite {
  @IsUUID(4) // Version 4
  id: string;

  @IsUUID(4)
  userID: string;

  @IsUUID(4)
  bookId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
