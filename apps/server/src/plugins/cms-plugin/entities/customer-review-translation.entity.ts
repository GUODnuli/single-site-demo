import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomerReview } from './customer-review.entity';

@Entity()
export class CustomerReviewTranslation extends VendureEntity implements Translation<CustomerReview> {
  constructor(input?: DeepPartial<CustomerReviewTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode!: LanguageCode;

  @Column('text', { default: '' })
  content!: string;

  @ManyToOne(() => CustomerReview, (base) => base.translations, { onDelete: 'CASCADE' })
  base!: CustomerReview;
}
