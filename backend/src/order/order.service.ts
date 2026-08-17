import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
  ScheduleEntity,
} from '../repository/films-repository.interface';

interface SessionBooking {
  filmId: string;
  sessionId: string;
  schedule: ScheduleEntity;
  seats: string[];
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    if (!order?.tickets?.length) {
      throw new BadRequestException({ error: 'Tickets list is empty' });
    }

    const bookings = new Map<string, SessionBooking>();

    for (const ticket of order.tickets) {
      const bookingKey = `${ticket.film}:${ticket.session}`;
      const seatKey = `${ticket.row}:${ticket.seat}`;
      let booking = bookings.get(bookingKey);

      if (!booking) {
        const schedule = await this.filmsRepository.findSchedule(
          ticket.film,
          ticket.session,
        );

        if (!schedule) {
          throw new NotFoundException({
            error: `Session ${ticket.session} for film ${ticket.film} not found`,
          });
        }

        booking = {
          filmId: ticket.film,
          sessionId: ticket.session,
          schedule,
          seats: [],
        };
        bookings.set(bookingKey, booking);
      }

      if (
        !Number.isInteger(ticket.row) ||
        !Number.isInteger(ticket.seat) ||
        ticket.row < 1 ||
        ticket.row > booking.schedule.rows ||
        ticket.seat < 1 ||
        ticket.seat > booking.schedule.seats
      ) {
        throw new BadRequestException({ error: `Invalid seat ${seatKey}` });
      }

      if (
        booking.schedule.taken.includes(seatKey) ||
        booking.seats.includes(seatKey)
      ) {
        throw new BadRequestException({
          error: `Seat ${seatKey} is already taken`,
        });
      }

      booking.seats.push(seatKey);
    }

    for (const booking of bookings.values()) {
      const reserved = await this.filmsRepository.reserveSeats(
        booking.filmId,
        booking.sessionId,
        booking.seats,
      );

      if (!reserved) {
        throw new BadRequestException({
          error: 'One or more selected seats are already taken',
        });
      }
    }

    const items: OrderResultDto[] = order.tickets.map((ticket) => {
      const booking = bookings.get(`${ticket.film}:${ticket.session}`);

      if (!booking) {
        throw new NotFoundException({ error: 'Session not found' });
      }

      return {
        id: randomUUID(),
        film: ticket.film,
        session: ticket.session,
        daytime: booking.schedule.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: booking.schedule.price,
      };
    });

    return { total: items.length, items };
  }
}
