import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CaseCategory } from './case-category.entity';

@Entity()
export class CaseCategoryTranslation extends VendureEntity implements Translation<CaseCategory> {
  constructor(input?: DeepPartial<CaseCategoryTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode!: LanguageCode;

  @Column({ default: '' })
  name!: string;

  @ManyToOne(() => CaseCategory, (base) => base.translations, { onDelete: 'CASCADE' })
  base!: CaseCategory;
}
