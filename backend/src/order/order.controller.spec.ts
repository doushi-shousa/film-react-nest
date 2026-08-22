import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(orderServiceMock)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  describe('createOrder', () => {
    it('passes order data to OrderService and returns created order', async () => {
      const order: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-08-23T18:00:00.000Z',
            row: 1,
            seat: 2,
            price: 500,
          },
        ],
      };

      const result: OrderResponseDto = {
        total: 1,
        items: [
          {
            id: 'order-item-1',
            ...order.tickets[0],
          },
        ],
      };

      orderServiceMock.createOrder.mockResolvedValue(result);

      await expect(controller.createOrder(order)).resolves.toEqual(result);
      expect(orderServiceMock.createOrder).toHaveBeenCalledWith(order);
      expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);
    });
  });
});
