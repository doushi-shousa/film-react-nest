import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (
      value === null ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return String(value);
    }

    if (value === undefined) {
      return 'undefined';
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private escape(value: unknown): string {
    return this.stringify(value)
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n');
  }

  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const fields = [
      `level=${this.escape(level)}`,
      `message=${this.escape(message)}`,
      ...optionalParams.map(
        (param, index) => `param${index}=${this.escape(param)}`,
      ),
    ];

    return `${fields.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }
}
