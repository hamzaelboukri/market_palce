import { IsEmail, IsString, IsOptional } from 'class-validator';

export class MockLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
