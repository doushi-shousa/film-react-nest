import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from './films-repository.interface';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmRepository.find({
      relations: {
        schedule: true,
      },
    });
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });
  }

  async findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    return this.scheduleRepository.findOne({
      where: {
        id: sessionId,
        film: {
          id: filmId,
        },
      },
    });
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(Schedule);

      const schedule = await repository
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule."filmId" = :filmId', { filmId })
        .getOne();

      if (!schedule) {
        return false;
      }

      if (seats.some((seat) => schedule.taken.includes(seat))) {
        return false;
      }

      schedule.taken = [...schedule.taken, ...seats];

      await repository.save(schedule);

      return true;
    });
  }
}
