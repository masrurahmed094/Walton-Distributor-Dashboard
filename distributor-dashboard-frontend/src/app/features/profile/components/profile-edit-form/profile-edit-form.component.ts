import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../../../core/models/user.model';

// Defines the shape of the data that can be updated.
export interface UpdateProfilePayload {
  name: string;
  email: string;
  department: string;
  phone: string;
}

@Component({
  selector: 'app-profile-edit-form',
  templateUrl: './profile-edit-form.component.html',
  styleUrls: ['./profile-edit-form.component.scss']
})
export class ProfileEditFormComponent implements OnInit {
  // Receives the current user profile to populate the form.
  @Input() userProfile: UserProfile | null = null;

  // Emits the updated data when the user saves.
  @Output() save = new EventEmitter<UpdateProfilePayload>();
  // Emits an event when the user cancels the edit.
  @Output() cancel = new EventEmitter<void>();

  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the reactive form with controls for the fields that can be updated.
    this.editForm = this.fb.group({
      name: [this.userProfile?.name || '', Validators.required],
      email: [this.userProfile?.email || '', [Validators.required, Validators.email]],
      department: [this.userProfile?.department || '', Validators.required],
      phone: [this.userProfile?.phone || '', Validators.required]
    });
  }

  /**
   * Called when the form is submitted.
   * If the form is valid, it emits the form's value.
   */
  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }
    this.save.emit(this.editForm.value);
  }

  /**
   * Called when the cancel button is clicked.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}