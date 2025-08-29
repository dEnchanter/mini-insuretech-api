import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ActivatePolicyDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  pendingPolicyId!: number;
}
