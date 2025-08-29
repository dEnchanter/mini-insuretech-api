import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;
}
