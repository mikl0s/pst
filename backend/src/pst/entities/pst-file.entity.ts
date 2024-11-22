import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { PstEmail } from './pst-email.entity';

@Entity()
export class PstFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => PstEmail, email => email.pstFile)
  emails: PstEmail[];

  @CreateDateColumn()
  uploadedAt: Date;
}
