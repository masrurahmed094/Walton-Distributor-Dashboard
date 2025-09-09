import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { JwtResponse, LoginPayload, RegisterPayload, ResetPasswordPayload, SecurityQuestionResponse, UserProfile } from '../models/user.model';
import { ProfileService } from '../../features/profile/services/profile.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private profileService: ProfileService
  ) {
    this.loadInitialUser();
  }

  public get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  private loadInitialUser() {
    const token = this.getToken();
    if (token) {
      this.profileService.getProfile().subscribe({
        next: userProfile => this.currentUserSubject.next(userProfile),
        error: () => this.performLocalLogout() // If token is invalid, just log out locally
      });
    }
  }

  register(payload: RegisterPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<UserProfile> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => localStorage.setItem('authToken', response.token)),
      switchMap(() => this.profileService.getProfile()),
      tap(userProfile => {
        this.currentUserSubject.next(userProfile);
      })
    );
  }

  /**
   * Logs the user out by calling the backend to invalidate the token,
   * then clearing local storage and state.
   */
  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      // The finalize operator ensures that local logout happens
      // regardless of whether the API call succeeds or fails.
      finalize(() => {
        this.performLocalLogout();
      })
    ).subscribe();
  }

  /**
   * Handles the client-side part of the logout process.
   */
  private performLocalLogout() {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  requestSecurityQuestion(username: string): Observable<SecurityQuestionResponse> {
    return this.http.post<SecurityQuestionResponse>(`${this.apiUrl}/forgot-password/request`, { username });
  }

  resetPassword(payload: ResetPasswordPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password/reset`, payload);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRoles(): string[] {
    return this.currentUserValue?.roles || [];
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

