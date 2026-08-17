import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from './films-repository.interface';

@Injectable()
export class FilmsMemoryRepository implements FilmsRepository {
  private readonly films: FilmEntity[];

  constructor() {
    const stubPath = path.join(
      process.cwd(),
      'test',
      'mongodb_initial_stub.json',
    );
    const raw = fs.readFileSync(stubPath, 'utf-8');
    this.films = JSON.parse(raw) as FilmEntity[];
  }

  async findAll(): Promise<FilmEntity[]> {
    return this.films.map((film) => this.cloneFilm(film));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = this.films.find((item) => item.id === id);
    return film ? this.cloneFilm(film) : null;
  }

  async findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);

    return session ? this.cloneSchedule(session) : null;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);

    if (!session || seats.some((seat) => session.taken.includes(seat))) {
      return false;
    }

    session.taken.push(...seats);
    return true;
  }

  private cloneFilm(film: FilmEntity): FilmEntity {
    return {
      ...film,
      tags: [...film.tags],
      schedule: film.schedule.map((session) => this.cloneSchedule(session)),
    };
  }

  private cloneSchedule(session: ScheduleEntity): ScheduleEntity {
    return {
      ...session,
      taken: [...session.taken],
    };
  }
}
