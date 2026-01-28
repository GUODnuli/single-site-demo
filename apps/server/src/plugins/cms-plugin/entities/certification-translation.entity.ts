import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Certification } from './certification.entity';

@Entity()
export class CertificationTranslation extends VendureEntity implements Translation<Certification> {
  constructor(input?: DeepPartial<CertificationTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode!: LanguageCode;

  @Column({ default: '' })
  name!: string;

  @Column('text', { default: '' })
  description!: string;

  @ManyToOne(() => Certification, (base) => base.translations, { onDelete: 'CASCADE' })
  base!: Certification;
}
