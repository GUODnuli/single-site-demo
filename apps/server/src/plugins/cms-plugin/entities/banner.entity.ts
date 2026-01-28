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
import { BannerTranslation } from './banner-translation.entity';

@Entity()
export class Banner extends VendureEntity implements Translatable, ChannelAware {
  constructor(input?: DeepPartial<Banner>) {
    super(input);
  }

  @Column({ default: '' })
  code: string;

  @Column('int', { default: 0 })
  position: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  link: string;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  image: Asset;

  @OneToMany(() => BannerTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<Banner>>;

  @ManyToMany(() => Channel)
  @JoinTable()
  channels: Channel[];

  // Translatable fields
  title: LocaleString;
  subtitle: LocaleString;
}
