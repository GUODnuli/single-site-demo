import { DeepPartial, ID, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

export type EventCategory =
  | 'product'
  | 'cart'
  | 'checkout'
  | 'contact'
  | 'navigation'
  | 'engagement'
  | 'error'
  | 'custom';

@Entity()
@Index(['eventName', 'createdAt'])
@Index(['category', 'createdAt'])
@Index(['sessionId'])
export class AnalyticsEvent extends VendureEntity {
  constructor(input?: DeepPartial<AnalyticsEvent>) {
    super(input);
  }

  @Column()
  @Index()
  eventName: string;

  @Column({ default: 'custom' })
  category: EventCategory;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ type: 'simple-json', nullable: true })
  properties: Record<string, unknown>;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  userId: ID;

  @Column({ nullable: true })
  productId: ID;

  @Column({ nullable: true })
  orderId: ID;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  locale: string;
}
