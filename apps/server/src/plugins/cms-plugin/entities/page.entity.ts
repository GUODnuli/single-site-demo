import {
  DeepPartial,
  VendureEntity,
  LocaleString,
  Translatable,
  Translation,
  ChannelAware,
  Channel,
} from '@vendure/core';
import { Column, Entity, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { PageTranslation } from './page-translation.entity';

@Entity()
export class Page extends VendureEntity implements Translatable, ChannelAware {
  constructor(input?: DeepPartial<Page>) {
    super(input);
  }

  @Column({ unique: true })
  slug: string;

  @Column({ default: true })
  enabled: boolean;

  @OneToMany(() => PageTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<Page>>;

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];

  // Translatable fields
  title: LocaleString;
  content: LocaleString;
  seoTitle: LocaleString;
  seoDescription: LocaleString;
}
