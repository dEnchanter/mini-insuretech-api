import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
} from 'sequelize-typescript';
import { Plan } from './plan.entity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Table({
  tableName: 'policies',
  timestamps: true,
})
export class Policy extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare policyNumber: string;

  @ForeignKey(() => Plan)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare planId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare productId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare activatedAt: Date;

  @BelongsTo(() => Plan)
  declare plan: Plan;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Product)
  declare product: Product;

  @BeforeCreate
  static generatePolicyNumber(policy: Policy) {
    policy.policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
}
