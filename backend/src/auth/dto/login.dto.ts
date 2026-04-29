import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/users/user.entity';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
