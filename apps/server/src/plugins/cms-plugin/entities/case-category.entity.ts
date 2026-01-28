import {
  DeepPartial,
  VendureEntity,
  LocaleString,
  Translatable,
  Translation,
} from '@vendure/core';
import { Column, Entity, OneToMany } from 'typeorm';
import { CaseCategoryTranslation } from './case-category-translation.entity';
import { CaseStudy } from './case-study.entity';

@Entity()
export class CaseCategory extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<CaseCategory>) {
    super(input);
  }

  @Column({ unique: true })
  code: string;

  @Column('int', { default: 0 })
  position: number;

  // 2. 使用字符串引用
  @OneToMany(() => CaseCategoryTranslation, 'base', { cascade: true })
  translations!: CaseCategoryTranslation[];

  @OneToMany(() => CaseStudy, (caseStudy) => caseStudy.category)
  caseStudies: CaseStudy[];

  // Translatable field
  name: LocaleString;
}
