import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('formats fields as tab-separated key-value pairs', () => {
      expect(
        logger.formatMessage('log', 'Application started', 'NestApplication'),
      ).toBe(
        'level=log\tmessage=Application started\tparam0=NestApplication\n',
      );
    });

    it('escapes tabs and line breaks to keep a single TSKV record', () => {
      expect(logger.formatMessage('warn', 'line1\nline2\tvalue')).toBe(
        'level=warn\tmessage=line1\\nline2\\tvalue\n',
      );
    });

    it('serializes object parameters as string values', () => {
      expect(logger.formatMessage('log', 'request', { status: 200 })).toBe(
        'level=log\tmessage=request\tparam0={"status":200}\n',
      );
    });
  });

  describe('log methods', () => {
    it('writes formatted logs to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Application started');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=log\tmessage=Application started\n',
      );
    });

    it('writes formatted errors to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Database unavailable');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Database unavailable\n',
      );
    });
  });
});
