import {
  DeepPartial,
  VendureEntity,
  LocaleString,
  Translatable,
  ChannelAware,
  Channel,
} from '@vendure/core';
import { Column, Entity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { PageTranslation } from './page-translation.entity'; // ✅ 恢复导入

@Entity()
export class Page extends VendureEntity implements Translatable, ChannelAware {
  constructor(input?: DeepPartial<Page>) {
    super(input);
  }

  @Column({ unique: true })
  slug!: string;

  @Column({ default: true })
  enabled!: boolean;

  // 使用箭头函数延迟加载，避免循环依赖
  @OneToMany(() => PageTranslation, translation => translation.base, { cascade: true })
  translations!: PageTranslation[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels!: Channel[];

  // Translatable fields
  title!: LocaleString;
  content!: LocaleString;
  seoTitle!: LocaleString;
  seoDescription!: LocaleString;
}