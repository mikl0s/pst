import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { PstFile } from './pst-file.entity';

@Entity()
@Index(['pstFile', 'messageId'])
export class PstEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  messageId: string;

  @Column()
  subject: string;

  @Column()
  from: string;

  @Column('text', { array: true })
  to: string[];

  @Column('text', { array: true, nullable: true })
  cc: string[];

  @Column('text', { array: true, nullable: true })
  bcc: string[];

  @Column({ type: 'timestamp' })
  sentDate: Date;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  attachments: Record<string, any>[];

  @Column({ type: 'jsonb', nullable: true })
  headers: Record<string, any>;

  @ManyToOne(() => PstFile, pstFile => pstFile.emails, { onDelete: 'CASCADE' })
  pstFile: PstFile;

  @CreateDateColumn()
  processedAt: Date;
}
