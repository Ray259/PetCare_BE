import { IsAlphanumeric, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 20)
  password: string;
}
