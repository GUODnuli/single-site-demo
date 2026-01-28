import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['productId', 'createdAt'])
@Index(['sessionId'])
export class ProductView extends VendureEntity {
  constructor(input?: DeepPartial<ProductView>) {
    super(input);
  }

  @Column({ type: 'bigint' })
  @Index()
  productId!: number;

  @Column({ type: 'bigint', nullable: true })
  productVariantId!: number;

  @Column({ nullable: true })
  sessionId!: string;

  @Column({ type: 'bigint', nullable: true })
  userId!: number;

  @Column({ nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @Column({ nullable: true })
  referrer!: string;

  @Column({ nullable: true })
  country!: string;

  @Column({ nullable: true })
  city!: string;

  @Column({ nullable: true })
  device!: string;

  @Column({ nullable: true })
  browser!: string;

  @Column({ nullable: true })
  os!: string;

  @Column({ default: 0 })
  durationSeconds!: number;

  @Column({ nullable: true })
  locale!: string;
}
