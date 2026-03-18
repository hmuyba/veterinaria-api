import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClinicalRecord } from './clinical-record.entity';

@Entity('treatments')
export class Treatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClinicalRecord, (record) => record.treatments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clinical_record_id' })
  clinicalRecord: ClinicalRecord;

  @Column()
  medicamento: string;

  @Column()
  dosis: string;

  @Column({ nullable: true })
  duracion: string;

  @Column({ type: 'text', nullable: true })
  indicaciones: string;
}
