import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException, HttpStatus
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';
  import { StatusCodesList } from '../constants/status-code-list.constants';
  
  interface Response<T> {
    status: string;
    code: number;
    data?: T;
    error?: string;
  }
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map((data) => ({
          status: 'success',
          code: StatusCodesList.Success,
          statusCode: HttpStatus.OK,
          data,
        })),
        // catchError((error) => {
        //   const status = error instanceof HttpException ? error.getStatus() : 500;
        //   const response: Response<T> = {
        //     status: 'fail',
        //     code: status,
        //     error: error.message || 'Internal Server Error',
        //   };
        //   return throwError(() => new Error(JSON.stringify(response)));
        // }),
      );
    }
  }
  