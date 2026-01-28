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
  code!: string;

  @Column('int', { default: 0 })
  position!: number;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ nullable: true })
  link!: string;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  image!: Asset;

  // 修复这里：使用字符串引用避免循环依赖
  @OneToMany(() => BannerTranslation, 'base', { cascade: true })
  translations!: BannerTranslation[];

  @ManyToMany(() => Channel)
  @JoinTable()
  channels!: Channel[];

  // Translatable fields
  title!: LocaleString;
  subtitle!: LocaleString;
}
