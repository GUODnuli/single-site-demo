import {
  DeepPartial,
  VendureEntity,
  LocaleString,
  Translatable,
  Translation,
} from '@vendure/core';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CustomerReviewTranslation } from './customer-review-translation.entity';
import { CaseStudy } from './case-study.entity';

@Entity()
export class CustomerReview extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<CustomerReview>) {
    super(input);
  }

  @Column()
  customerName: string;

  @Column({ nullable: true })
  customerCompany: string;

  @Column('int', { default: 5 })
  rating: number;

  @Column({ default: true })
  enabled: boolean;

  @Column('int', { default: 0 })
  position: number;

  @ManyToOne(() => CaseStudy, (caseStudy) => caseStudy.reviews, { nullable: true, onDelete: 'SET NULL' })
  caseStudy: CaseStudy;

  @OneToMany(() => CustomerReviewTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<CustomerReview>>;

  // Translatable field
  content: LocaleString;
}
