import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('formats log data as JSON with level, message and optional params', () => {
      const result = logger.formatMessage('log', 'Application started', {
        port: 3000,
      });

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'Application started',
        optionalParams: [{ port: 3000 }],
      });
    });
  });

  describe('log methods', () => {
    it('writes formatted log messages to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Application started', 'NestApplication');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Application started',
          optionalParams: ['NestApplication'],
        }),
      );
    });

    it('writes formatted errors to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Database unavailable', 'Database');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Database unavailable',
          optionalParams: ['Database'],
        }),
      );
    });

    it('writes formatted warnings to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Slow request');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Slow request',
          optionalParams: [],
        }),
      );
    });
  });
});
