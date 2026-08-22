import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsListDto, ScheduleListDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue(filmsServiceMock)
      .compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  describe('findAll', () => {
    it('returns films received from FilmsService', async () => {
      const films: FilmsListDto = {
        total: 1,
        items: [
          {
            id: 'film-1',
            rating: 8.5,
            director: 'Director',
            tags: ['drama'],
            image: '/content/image.jpg',
            cover: '/content/cover.jpg',
            title: 'Film',
            about: 'About film',
            description: 'Description',
            schedule: [],
          },
        ],
      };

      filmsServiceMock.findAll.mockResolvedValue(films);

      await expect(controller.findAll()).resolves.toEqual(films);
      expect(filmsServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findSchedule', () => {
    it('passes film id to FilmsService and returns its schedule', async () => {
      const schedule: ScheduleListDto = {
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2026-08-23T18:00:00.000Z',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 500,
            taken: ['1:1'],
          },
        ],
      };

      filmsServiceMock.findSchedule.mockResolvedValue(schedule);

      await expect(controller.findSchedule('film-1')).resolves.toEqual(
        schedule,
      );
      expect(filmsServiceMock.findSchedule).toHaveBeenCalledWith('film-1');
      expect(filmsServiceMock.findSchedule).toHaveBeenCalledTimes(1);
    });
  });
});
