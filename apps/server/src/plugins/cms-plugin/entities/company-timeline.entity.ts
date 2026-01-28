import {
  DeepPartial,
  VendureEntity,
  Asset,
  LocaleString,
  Translatable,
  Translation,
} from '@vendure/core';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CompanyTimelineTranslation } from './company-timeline-translation.entity';

@Entity()
export class CompanyTimeline extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<CompanyTimeline>) {
    super(input);
  }

  @Column('int')
  year: number;

  @Column('int', { default: 0 })
  position: number;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  image: Asset;

  @OneToMany(() => CompanyTimelineTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<CompanyTimeline>>;

  // Translatable fields
  title: LocaleString;
  description: LocaleString;
}
