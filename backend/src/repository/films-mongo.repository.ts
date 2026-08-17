import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './film.schema';
import {
  FilmEntity,
  FilmsRepository,
  ScheduleEntity,
} from './films-repository.interface';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    return this.filmModel.find().lean<FilmEntity[]>().exec();
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).lean<FilmEntity>().exec();
  }

  async findSchedule(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleEntity | null> {
    const film = await this.findById(filmId);
    return film?.schedule.find((session) => session.id === sessionId) ?? null;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $nin: seats },
          },
        },
      },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );

    return result.modifiedCount === 1;
  }
}
