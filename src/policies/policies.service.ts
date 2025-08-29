import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  Policy,
  PendingPolicy,
  Plan,
  User,
  Product,
  PendingPolicyStatus,
} from '../entities';
import { ActivatePolicyDto } from './dto/activate-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy)
    private policyModel: typeof Policy,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    @InjectModel(Plan)
    private planModel: typeof Plan,
    private sequelize: Sequelize,
  ) {}

  async activate(activatePolicyDto: ActivatePolicyDto) {
    const { pendingPolicyId } = activatePolicyDto;

    return this.sequelize.transaction(async (transaction) => {
      const pendingPolicy = await this.pendingPolicyModel.findOne({
        where: {
          id: pendingPolicyId,
          status: PendingPolicyStatus.UNUSED,
        },
        include: [Plan],
        transaction,
      });

      if (!pendingPolicy) {
        throw new NotFoundException('Pending policy not found or already used');
      }

      const existingPolicy = await this.policyModel.findOne({
        where: {
          userId: pendingPolicy.plan.userId,
          productId: pendingPolicy.plan.productId,
        },
        transaction,
      });

      if (existingPolicy) {
        throw new BadRequestException(
          'User already has a policy for this product',
        );
      }

      const policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const policy = await this.policyModel.create(
        {
          policyNumber,
          planId: pendingPolicy.planId,
          userId: pendingPolicy.plan.userId,
          productId: pendingPolicy.plan.productId,
          activatedAt: new Date(),
        },
        { transaction },
      );

      await pendingPolicy.update(
        { status: PendingPolicyStatus.USED },
        { transaction },
      );

      await pendingPolicy.destroy({ transaction });

      return this.policyModel.findByPk(policy.id, {
        include: [Plan, User, Product],
        transaction,
      });
    });
  }

  async findAll(planId?: number) {
    const whereClause = planId ? { planId } : {};

    return this.policyModel.findAll({
      where: whereClause,
      include: [
        { model: Plan },
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Product },
      ],
      order: [['activatedAt', 'DESC']],
    });
  }
}
