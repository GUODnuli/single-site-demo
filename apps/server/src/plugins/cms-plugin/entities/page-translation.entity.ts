import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Page } from './page.entity'; // ✅ 恢复导入

@Entity()
export class PageTranslation extends VendureEntity implements Translation<Page> { // ✅ 恢复正确类型
  constructor(input?: DeepPartial<PageTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode!: LanguageCode;

  @Column({ default: '' })
  title!: string;

  @Column({ type: 'text', default: '' })
  content!: string;

  @Column({ default: '' })
  seoTitle!: string;

  @Column({ default: '' })
  seoDescription!: string;

  // 使用箭头函数延迟加载，避免循环依赖
  @ManyToOne(() => Page, page => page.translations, { onDelete: 'CASCADE' })
  base!: Page;
}