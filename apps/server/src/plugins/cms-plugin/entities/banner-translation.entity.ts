import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Banner } from './banner.entity';

@Entity()
export class BannerTranslation extends VendureEntity implements Translation<Banner> {
  constructor(input?: DeepPartial<BannerTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode!: LanguageCode;

  @Column({ default: '' })
  title!: string;

  @Column({ default: '' })
  subtitle!: string;

  @ManyToOne(() => Banner, (base) => base.translations, { onDelete: 'CASCADE' })
  base!: Banner;
}
