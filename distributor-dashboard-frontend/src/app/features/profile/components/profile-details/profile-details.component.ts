import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserProfile } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent {
  // Receives the user profile data from the parent component.
  @Input() userProfile: UserProfile | null = null;

  // Emits an event to the parent component when the user clicks 'Edit'.
  @Output() edit = new EventEmitter<void>();

  // Emits an event to the parent component when the user clicks 'Delete'.
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  /**
   * Called when the edit button is clicked.
   */
  onEdit(): void {
    this.edit.emit();
  }

  /**
   * Called when the delete button is clicked.
   */
  onDelete(): void {
    this.delete.emit();
  }
}