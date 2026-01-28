import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CaseStudy } from './case-study.entity';

@Entity()
export class CaseStudyTranslation extends VendureEntity implements Translation<CaseStudy> {
  constructor(input?: DeepPartial<CaseStudyTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode: LanguageCode;

  @Column({ default: '' })
  title: string;

  @Column('text', { default: '' })
  description: string;

  @Column('text', { default: '' })
  content: string;

  @ManyToOne(() => CaseStudy, (base) => base.translations, { onDelete: 'CASCADE' })
  base: CaseStudy;
}
