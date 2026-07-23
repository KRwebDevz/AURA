import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerManager } from './logger.manager';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerManager) {
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const requestId =
      (request.headers['x-request-id'] as string) || randomUUID();
    request.requestId = requestId;

    if (response && typeof response.setHeader === 'function') {
      response.setHeader('X-Request-ID', requestId);
    }

    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const delay = Date.now() - now;

        this.logger.info(`${method} ${url} ${statusCode} +${delay}ms`, {
          requestId,
          method,
          url,
          statusCode,
          responseTimeMs: delay,
        });
      }),
    );
  }
}
