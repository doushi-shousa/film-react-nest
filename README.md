# FILM! — модульный API-сервис

Backend проекта Film! реализован на Nest.js. Сервис предоставляет API афиши кинотеатра, расписание сеансов и бронирование билетов. Данные фильмов и занятых мест хранятся в MongoDB через Mongoose; для автоматических e2e-проверок предусмотрен in-memory репозиторий с тем же контрактом.

## Структура backend

- `src/films` — контроллер, сервис и DTO фильмов и расписания;
- `src/order` — контроллер, сервис и DTO бронирования;
- `src/repository` — интерфейс репозитория, MongoDB- и in-memory-реализации, Mongoose-схема;
- `public/content/afisha` — статические изображения афиши;
- `test/mongodb_initial_stub.json` — исходные данные для наполнения MongoDB.

## API

- `GET /api/afisha/films` — список фильмов;
- `GET /api/afisha/films/:id/schedule` — расписание выбранного фильма;
- `POST /api/afisha/order` — бронирование одного или нескольких билетов;
- `GET /content/afisha/*` — статический контент.

При бронировании место хранится в `taken` в формате `row:seat`. Повторное бронирование уже занятого места завершается ошибкой `400`.

## Переменные окружения

Создайте `backend/.env` на основе `backend/.env.example`:

```env
PORT=3000
DATABASE_DRIVER=mongodb
DATABASE_URL=mongodb://127.0.0.1:27017/prac
DEBUG=*
```

`DATABASE_DRIVER=mongodb` включает MongoDB-репозиторий. Значение `inmemory` используется для локальных автоматических проверок без подключения к MongoDB.

## MongoDB

1. Запустите MongoDB.
2. Создайте базу, указанную в `DATABASE_URL`.
3. Импортируйте `backend/test/mongodb_initial_stub.json` в коллекцию `films` через MongoDB Compass (`Add Data` → `Import JSON or CSV file`).

## Запуск backend

```bash
cd backend
npm ci
npm run start:dev
```

По умолчанию сервер доступен на `http://localhost:3000`.

## Проверки

```bash
cd backend
npm run lint
npm run build
npm test -- --runInBand --passWithNoTests
npm run test:e2e -- --runInBand
```

E2E-тесты проверяют получение списка фильмов, расписание, успешное бронирование и запрет повторного бронирования одного места.

## Frontend

Настройки frontend находятся в `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3000/api/afisha
VITE_CDN_URL=http://localhost:3000/content/afisha
```

После настройки переменных окружения frontend можно запустить стандартной командой проекта.