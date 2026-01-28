import { DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class ContactSubmission extends VendureEntity {
  constructor(input?: DeepPartial<ContactSubmission>) {
    super(input);
  }

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  company!: string;

  @Column('text')
  message!: string;

  @Column({ nullable: true })
  source!: string;

  @Column({ nullable: true })
  ipAddress!: string;

  @Column({ nullable: true })
  userAgent!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column('text', { nullable: true })
  notes!: string;
}
