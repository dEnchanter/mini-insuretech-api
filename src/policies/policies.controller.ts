import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { ActivatePolicyDto } from './dto/activate-policy.dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post('activate')
  async activate(@Body() activatePolicyDto: ActivatePolicyDto) {
    return this.policiesService.activate(activatePolicyDto);
  }

  @Get()
  async findAll(@Query('planId') planId?: string) {
    const parsedPlanId = planId ? parseInt(planId, 10) : undefined;
    return this.policiesService.findAll(parsedPlanId);
  }
}
