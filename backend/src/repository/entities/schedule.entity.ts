import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';
import { Film } from './film.entity';

const takenTransformer: ValueTransformer = {
  to: (value: string[] | null | undefined): string =>
    Array.isArray(value) ? value.join(',') : '',
  from: (value: string | null): string[] =>
    value ? value.split(',').filter(Boolean) : [],
};

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  daytime: string;

  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({
    type: 'text',
    transformer: takenTransformer,
  })
  taken: string[];

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
