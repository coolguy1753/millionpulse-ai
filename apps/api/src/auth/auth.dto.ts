import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  totp?: string; // 2FA code, required if the user has 2FA enabled
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class AcceptInviteDto {
  @IsString()
  token!: string;

  @IsString()
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
