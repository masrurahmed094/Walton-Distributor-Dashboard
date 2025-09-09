import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../core/models/user.model';
import { UpdateProfilePayload } from '../components/profile-edit-form/profile-edit-form.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8081/api/profile';

  constructor(private http: HttpClient) { }

  /**
   * Fetches the profile information for the currently authenticated user.
   *
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  /**
   * Updates the profile information for the currently authenticated user.
   *
   */
  updateProfile(payload: UpdateProfilePayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.apiUrl, payload);
  }

  /**
   * Deletes the account of the currently authenticated user.
   *
   */
  deleteProfile(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl);
  }
}