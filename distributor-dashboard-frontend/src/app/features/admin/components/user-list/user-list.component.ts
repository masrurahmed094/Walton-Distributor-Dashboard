import { Component, Input } from '@angular/core';
import { UserProfile } from '../../../../core/models/user.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input() users: UserProfile[] = [];

  constructor(private adminService: AdminService) {}

  onAccessChange(user: UserProfile, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newStatus = input.checked;

    // Calls the service to update the user's 'isActive' status
    this.adminService.updateUserAccess(user.id, newStatus).subscribe({
      next: (response) => {
        user.active = newStatus;
        console.log(response.message);
      },
      error: (err) => {
        input.checked = !newStatus;
        console.error('Failed to update user access:', err);
      }
    });
  }
}