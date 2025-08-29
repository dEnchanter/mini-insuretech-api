import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plan, Product, User, PendingPolicy } from '../entities';

@Module({
  imports: [SequelizeModule.forFeature([Plan, Product, User, PendingPolicy])],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
