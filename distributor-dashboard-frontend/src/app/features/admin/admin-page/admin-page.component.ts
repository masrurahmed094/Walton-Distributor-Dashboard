import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { UserProfile } from '../../../core/models/user.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  users$!: Observable<UserProfile[] | null>;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.users$ = this.adminService.getAllUsers().pipe(
      catchError(error => {
        console.error('Failed to fetch users:', error);
        return of(null);
      })
    );
  }
}