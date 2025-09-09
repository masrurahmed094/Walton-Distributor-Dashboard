import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

const DEFAULT_TIMEOUT = 15000; // 15 seconds

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {

  constructor() {}

  /**
   * Intercepts every outgoing HTTP request and applies a 15-second timeout.
   * If a request takes longer than the specified time, it will throw a specific error.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      timeout(DEFAULT_TIMEOUT),
      catchError(err => {
        // Check if the error is a TimeoutError
        if (err.name === 'TimeoutError') {
          console.error('Request timed out:', request.url);
          // Return a more user-friendly error
          return throwError(() => new Error('The request took too long to respond. Please try again.'));
        }
        // Re-throw other errors
        return throwError(() => err);
      })
    );
  }
}

