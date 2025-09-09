import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { UserProfile } from '../../../core/models/user.model';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { UpdateProfilePayload } from '../components/profile-edit-form/profile-edit-form.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  userProfile$!: Observable<UserProfile | null>;
  isEditing = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userProfile$ = this.profileService.getProfile().pipe(
      catchError(error => {
        console.error('Failed to load profile:', error);
        this.errorMessage = 'Could not load your profile data.';
        return of(null);
      })
    );
  }

  onSaveProfile(payload: UpdateProfilePayload): void {
    this.profileService.updateProfile(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.isEditing = false;
        this.loadProfile(); // Refresh the profile data
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
      }
    });
  }

  onDeleteProfile(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.profileService.deleteProfile().subscribe({
        next: () => {
          // On successful deletion, log the user out
          this.authService.logout();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to delete profile.';
        }
      });
    }
  }
}