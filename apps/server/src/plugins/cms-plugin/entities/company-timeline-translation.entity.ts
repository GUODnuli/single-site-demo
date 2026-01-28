import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CompanyTimeline } from './company-timeline.entity';

@Entity()
export class CompanyTimelineTranslation extends VendureEntity implements Translation<CompanyTimeline> {
  constructor(input?: DeepPartial<CompanyTimelineTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode: LanguageCode;

  @Column({ default: '' })
  title: string;

  @Column('text', { default: '' })
  description: string;

  @ManyToOne(() => CompanyTimeline, (base) => base.translations, { onDelete: 'CASCADE' })
  base: CompanyTimeline;
}
