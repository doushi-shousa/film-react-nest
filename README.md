# FILM! — модульный API-сервис

Film! — сервис бронирования билетов в кинотеатр.

Проект состоит из:

- frontend на React;
- backend на Nest.js;
- PostgreSQL для хранения фильмов, расписания сеансов и занятых мест;
- TypeORM для взаимодействия backend с PostgreSQL.

В этой версии проекта слой хранения данных мигрирован с MongoDB/Mongoose на PostgreSQL/TypeORM.

## Backend

Backend предоставляет API афиши кинотеатра, расписания и бронирования билетов.

Основные модули:

- `backend/src/films` — контроллер, сервис и DTO фильмов и расписания;
- `backend/src/order` — контроллер, сервис и DTO бронирования;
- `backend/src/repository` — интерфейс `FilmsRepository` и PostgreSQL-реализация репозитория;
- `backend/src/repository/entities` — TypeORM-сущности `Film` и `Schedule`;
- `backend/public/content/afisha` — статический контент афиши;
- `backend/test` — e2e-тесты и SQL-файлы для создания и наполнения PostgreSQL.

## PostgreSQL и TypeORM

Для хранения данных используются две связанные таблицы:

- `films` — информация о фильмах;
- `schedules` — информация о сеансах и занятых местах.

Между сущностями настроена связь:

```text
Film 1 ---- N Schedule
```

Один фильм может содержать несколько сеансов.

Доступ к данным осуществляется через TypeORM-репозитории.

Сервисы приложения работают через интерфейс:

```text
FilmsRepository
```

Конкретная PostgreSQL-реализация:

```text
FilmsPostgresRepository
```

Контроллеры и сервисы не зависят напрямую от TypeORM.

## API

Backend работает с глобальным префиксом:

```text
/api/afisha
```

Основные эндпоинты:

```text
GET  /api/afisha/films
GET  /api/afisha/films/:id/schedule
POST /api/afisha/order
```

Статический контент:

```text
GET /content/afisha/*
```

### Получение фильмов

```http
GET /api/afisha/films
```

Возвращает список фильмов.

### Получение расписания

```http
GET /api/afisha/films/:id/schedule
```

Возвращает список сеансов выбранного фильма.

### Бронирование билетов

```http
POST /api/afisha/order
```

Позволяет забронировать один или несколько билетов.

Занятые места хранятся в поле `taken` сущности `Schedule`.

Формат места:

```text
row:seat
```

Например:

```text
1:5
3:7
```

Перед бронированием приложение проверяет, не занято ли место.

Повторная попытка забронировать уже занятое место завершается ошибкой `400`.

## Переменные окружения

Создайте файл:

```text
backend/.env
```

на основе:

```text
backend/.env.example
```

Пример:

```env
PORT=3000
DATABASE_DRIVER=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/films
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DEBUG=*
```

Используемые параметры:

- `PORT` — порт backend;
- `DATABASE_DRIVER` — драйвер базы данных, для проекта используется `postgres`;
- `DATABASE_URL` — строка подключения к PostgreSQL;
- `DATABASE_USERNAME` — пользователь PostgreSQL;
- `DATABASE_PASSWORD` — пароль PostgreSQL;
- `DEBUG` — настройки debug-логирования.

## Подготовка PostgreSQL

В `backend/test` находятся SQL-файлы стартового набора:

```text
prac.init.sql
prac.films.sql
prac.shedules.sql
```

Они используются для:

1. создания структуры БД;
2. наполнения таблицы фильмов;
3. наполнения таблицы расписания.

## Запуск PostgreSQL через Docker

В корне проекта находится:

```text
docker-compose.yml
```

Для запуска PostgreSQL:

```bash
docker compose up -d
```

Проверить контейнеры:

```bash
docker ps
```

Остановить:

```bash
docker compose down
```

## Установка backend

```bash
cd backend
npm ci
```

## Запуск backend

```bash
npm run start:dev
```

По умолчанию backend доступен по адресу:

```text
http://localhost:3000
```

API:

```text
http://localhost:3000/api/afisha
```

## Проверки backend

### Сборка

```bash
npm run build
```

### Линтинг

```bash
npm run lint
```

### Unit-тесты

```bash
npm test -- --runInBand --passWithNoTests
```

### E2E

```bash
npm run test:e2e -- --runInBand
```

E2E-проверки проверяют:

- получение списка фильмов;
- получение расписания фильма;
- создание заказа;
- сохранение занятых мест;
- запрет повторного бронирования уже занятого места.

## Frontend

Настройки frontend находятся в:

```text
frontend/.env.example
```

Пример:

```env
VITE_API_URL=http://localhost:3000/api/afisha
VITE_CDN_URL=http://localhost:3000/content/afisha
```

После установки зависимостей frontend запускается стандартной командой проекта:

```bash
npm run dev
```

## Основной стек

### Backend

- Node.js
- TypeScript
- Nest.js
- TypeORM
- PostgreSQL

### Frontend

- React

### Инфраструктура

- Docker
- GitHub Actions

## Автоматические проверки

GitHub Actions использует тестовый набор для проекта с миграцией базы данных на PostgreSQL.

Workflow:

```text
.github/workflows/tests.yml
```

Автотесты проверяют backend и API проекта.
