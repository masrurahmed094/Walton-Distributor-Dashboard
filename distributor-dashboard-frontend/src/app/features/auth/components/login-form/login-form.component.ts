import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the form with username and password controls and required validators
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Handles the form submission.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const payload = this.loginForm.value;

    // Calls the login method from the AuthService
    this.authService.login(payload).pipe(
      finalize(() => {
        // This ensures isLoading is set to false after the API call completes,
        // whether it succeeds or fails.
        this.isLoading = false;
      })
    ).subscribe({
      next: () => {
        // On successful login, navigate the user to the main dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // On error, display a user-friendly message
        this.errorMessage = 'Invalid username or password. Please try again.';
        console.error('Login failed:', err);
      }
    });
  }
}