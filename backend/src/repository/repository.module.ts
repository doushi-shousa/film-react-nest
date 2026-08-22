import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmsPostgresRepository } from './films-postgres.repository';
import { FILMS_REPOSITORY } from './films-repository.interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.getOrThrow<string>('DATABASE_DRIVER');

        if (driver !== 'postgres') {
          throw new Error(
            `Unsupported DATABASE_DRIVER: ${driver}. Expected "postgres".`,
          );
        }

        const connectionUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        connectionUrl.username =
          configService.getOrThrow<string>('DATABASE_USERNAME');

        connectionUrl.password =
          configService.getOrThrow<string>('DATABASE_PASSWORD');

        return {
          type: 'postgres' as const,
          url: connectionUrl.toString(),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),

    TypeOrmModule.forFeature([Film, Schedule]),
  ],

  providers: [
    FilmsPostgresRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsPostgresRepository,
    },
  ],

  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}
