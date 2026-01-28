import { DeepPartial, LanguageCode, Translation, VendureEntity } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TeamMember } from './team-member.entity';

@Entity()
export class TeamMemberTranslation extends VendureEntity implements Translation<TeamMember> {
  constructor(input?: DeepPartial<TeamMemberTranslation>) {
    super(input);
  }

  @Column('varchar')
  languageCode: LanguageCode;

  @Column({ default: '' })
  jobTitle: string;

  @Column('text', { default: '' })
  bio: string;

  @ManyToOne(() => TeamMember, (base) => base.translations, { onDelete: 'CASCADE' })
  base: TeamMember;
}
