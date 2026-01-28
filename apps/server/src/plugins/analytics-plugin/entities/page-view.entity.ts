import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['path', 'createdAt'])
@Index(['sessionId'])
export class PageView extends VendureEntity {
  constructor(input?: DeepPartial<PageView>) {
    super(input);
  }

  @Column()
  @Index()
  path!: string;

  @Column({ nullable: true })
  title!: string;

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
  utmSource!: string;

  @Column({ nullable: true })
  utmMedium!: string;

  @Column({ nullable: true })
  utmCampaign!: string;

  @Column({ nullable: true })
  country!: string;

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
