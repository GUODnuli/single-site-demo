import {
  DeepPartial,
  VendureEntity,
  Asset,
  LocaleString,
  Translatable,
  Translation,
} from '@vendure/core';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CertificationTranslation } from './certification-translation.entity';

@Entity()
export class Certification extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<Certification>) {
    super(input);
  }

  @Column({ unique: true })
  code: string;

  @Column('int', { default: 0 })
  position: number;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  icon: Asset;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  certificate: Asset;

  // 2. 使用字符串引用
  @OneToMany(() => CertificationTranslation, 'base', { cascade: true })
  translations!: CertificationTranslation[];

  // Translatable fields
  name: LocaleString;
  description: LocaleString;
}
