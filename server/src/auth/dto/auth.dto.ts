import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDtoRegister {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(3)
  username: string;
}

export class AuthDtoLogin {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}