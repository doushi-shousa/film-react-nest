export class ScheduleDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleDto[];
}

export class FilmsListDto {
  total: number;
  items: FilmDto[];
}

export class ScheduleListDto {
  total: number;
  items: ScheduleDto[];
}
