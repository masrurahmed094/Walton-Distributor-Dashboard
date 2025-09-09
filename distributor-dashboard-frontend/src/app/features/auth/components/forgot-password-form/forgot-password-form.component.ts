import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnInit {
  // Manages which step of the process is shown to the user
  step: 1 | 2 | 3 = 1; // 1: Enter username, 2: Answer question, 3: Success

  usernameForm!: FormGroup;
  resetForm!: FormGroup;

  securityQuestion: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Form for the first step: submitting the username
    this.usernameForm = this.fb.group({
      username: ['', Validators.required]
    });

    // Form for the second step: answering the question and setting a new password
    this.resetForm = this.fb.group({
      securityAnswer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Step 1: Submits the username to get the user's security question.
   */
  onRequestQuestion(): void {
    if (this.usernameForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const username = this.usernameForm.get('username')?.value;

    this.authService.requestSecurityQuestion(username).subscribe({
      next: (response) => {
        this.securityQuestion = response.securityQuestion;
        this.step = 2; // Move to the next step
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'User not found or an error occurred.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Step 2: Submits the security answer and new password to reset it.
   */
  onResetPassword(): void {
    if (this.resetForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const payload = {
      username: this.usernameForm.get('username')?.value,
      securityAnswer: this.resetForm.get('securityAnswer')?.value,
      newPassword: this.resetForm.get('newPassword')?.value
    };

    this.authService.resetPassword(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.step = 3; // Move to the final success step
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Incorrect security answer or an error occurred.';
        this.isLoading = false;
      }
    });
  }
}