import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { Schedule } from './schedule.entity';

const stringArrayTransformer: ValueTransformer = {
  to: (value: string[] | null | undefined): string =>
    Array.isArray(value) ? value.join(',') : '',
  from: (value: string | null): string[] =>
    value ? value.split(',').filter(Boolean) : [],
};

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  rating: number;

  @Column({ type: 'varchar' })
  director: string;

  @Column({
    type: 'text',
    transformer: stringArrayTransformer,
  })
  tags: string[];

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  cover: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  about: string;

  @Column({ type: 'varchar' })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
