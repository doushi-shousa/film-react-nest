import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './film.schema';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongoRepository } from './films-mongo.repository';
import { FILMS_REPOSITORY } from './films-repository.interface';

const useMongo = process.env.DATABASE_DRIVER === 'mongodb';

const repositoryProviders = useMongo
  ? [
      FilmsMongoRepository,
      {
        provide: FILMS_REPOSITORY,
        useExisting: FilmsMongoRepository,
      },
    ]
  : [
      FilmsMemoryRepository,
      {
        provide: FILMS_REPOSITORY,
        useExisting: FilmsMemoryRepository,
      },
    ];

@Module({
  imports: [
    ...(useMongo
      ? [
          MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              uri: configService.getOrThrow<string>('DATABASE_URL'),
            }),
          }),
          MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        ]
      : []),
  ],
  providers: repositoryProviders,
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
