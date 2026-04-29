import { IsInt, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateTechnicianDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @IsPositive()
  categoryId: number;
}
