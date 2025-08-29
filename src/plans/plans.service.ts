import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  Plan,
  Product,
  User,
  PendingPolicy,
  PendingPolicyStatus,
} from '../entities';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan)
    private planModel: typeof Plan,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(PendingPolicy)
    private pendingPolicyModel: typeof PendingPolicy,
    private sequelize: Sequelize,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    const { userId, productId, quantity } = createPlanDto;

    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userModel.findByPk(userId, { transaction });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const product = await this.productModel.findByPk(productId, {
        transaction,
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const totalAmount = Number(product.price) * quantity;

      if (Number(user.walletBalance) < totalAmount) {
        throw new BadRequestException('Insufficient wallet balance');
      }

      const plan = await this.planModel.create(
        {
          userId,
          productId,
          quantity,
          totalAmount,
          purchaseDate: new Date(),
        },
        { transaction },
      );

      await user.update(
        { walletBalance: Number(user.walletBalance) - totalAmount },
        { transaction },
      );

      for (let i = 0; i < quantity; i++) {
        await this.pendingPolicyModel.create(
          {
            planId: plan.id,
            status: PendingPolicyStatus.UNUSED,
          },
          { transaction },
        );
      }

      return this.planModel.findByPk(plan.id, {
        include: [
          { model: Product, as: 'product' },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          { model: PendingPolicy, as: 'pendingPolicies' },
        ],
        transaction,
      });
    });
  }

  async getPendingPolicies(planId: number) {
    const plan = await this.planModel.findByPk(planId, {
      include: [
        {
          model: PendingPolicy,
          as: 'pendingPolicies',
          where: { status: PendingPolicyStatus.UNUSED },
          required: false,
        },
      ],
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan.pendingPolicies;
  }
}
