import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Page } from './page.entity';

@Entity()
export class PageTranslation extends VendureEntity implements Translation<Page> {
  constructor(input?: DeepPartial<PageTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode: LanguageCode;

  @Column({ default: '' })
  title: string;

  @Column('text', { default: '' })
  content: string;

  @Column({ nullable: true })
  seoTitle: string;

  @Column({ nullable: true })
  seoDescription: string;

  @ManyToOne(() => Page, (base) => base.translations, { onDelete: 'CASCADE' })
  base: Page;
}
