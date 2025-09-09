import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  /**
   * Intercepts every outgoing HTTP request to add the JWT Authorization header.
   * This is the correct, centralized way to handle authentication for API calls.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Get the token directly from local storage.
    // This resolves the compilation error as the UserProfile object does not contain the token.
    const token = this.getTokenFromStorage();

    // 2. Check if a token exists.
    if (token) {
      // 3. If a token exists, clone the request to add the Authorization header.
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 4. Pass the (potentially modified) request on to the next handler in the chain.
    return next.handle(request);
  }

  private getTokenFromStorage(): string | null {
      // This method correctly retrieves the token from browser storage.
      return localStorage.getItem('authToken');
  }
}

