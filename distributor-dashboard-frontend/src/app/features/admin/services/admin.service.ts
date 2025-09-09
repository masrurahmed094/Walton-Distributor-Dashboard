import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8081/api/admin';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.apiUrl}/users`);
  }

  updateUserAccess(userId: number, isActive: boolean): Observable<{ message: string }> {
    const endpoint = `${this.apiUrl}/users/${userId}/access`;
    return this.http.put<{ message: string }>(endpoint, null, {
      params: { isActive: isActive.toString() }
    });
  }
}