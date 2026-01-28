import {
  DeepPartial,
  VendureEntity,
  Asset,
  LocaleString,
  Translatable,
  Translation,
} from '@vendure/core';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { TeamMemberTranslation } from './team-member-translation.entity';

@Entity()
export class TeamMember extends VendureEntity implements Translatable {
  constructor(input?: DeepPartial<TeamMember>) {
    super(input);
  }

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column('int', { default: 0 })
  position: number;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => Asset, { eager: true, nullable: true, onDelete: 'SET NULL' })
  photo: Asset;

  @OneToMany(() => TeamMemberTranslation, (translation) => translation.base, { eager: true })
  translations: Array<Translation<TeamMember>>;

  // Translatable fields
  jobTitle: LocaleString;
  bio: LocaleString;
}
