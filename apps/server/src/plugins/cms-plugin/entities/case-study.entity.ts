import {
  DeepPartial,
  VendureEntity,
  Asset,
  LocaleString,
  Translatable,
  Translation,
  ChannelAware,
  Channel,
} from '@vendure/core';
import { Column, Entity, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { CaseStudyTranslation } from './case-study-translation.entity';
import { CaseCategory } from './case-category.entity';
import { CustomerReview } from './customer-review.entity';

@Entity()
export class CaseStudy extends VendureEntity implements Translatable, ChannelAware {
  constructor(input?: DeepPartial<CaseStudy>) {
    super(input);
  }

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  enabled: boolean;

  @Column('int', { default: 0 })
  position: number;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  completedAt: Date;

  @ManyToOne(() => CaseCategory, (category) => category.caseStudies, { eager: true, nullable: true })
  category: CaseCategory;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  beforeImage: Asset;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  afterImage: Asset;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  featuredImage: Asset;

  @ManyToMany(() => Asset, { eager: true })
  @JoinTable()
  gallery: Asset[];

  @OneToMany(() => CustomerReview, (review) => review.caseStudy)
  reviews: CustomerReview[];

  @OneToMany(() => CaseStudyTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<CaseStudy>>;

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];

  // Translatable fields
  title: LocaleString;
  description: LocaleString;
  content: LocaleString;
}
