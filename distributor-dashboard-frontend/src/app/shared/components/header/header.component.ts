import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators'; // <-- Import tap
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$!: Observable<any | null>;
  isAdmin$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;

    this.isAdmin$ = this.currentUser$.pipe(
      // Add this line to log the user object to the console for debugging
      tap(user => console.log('Current User Object from Token:', user)),
      map(user => user?.roles?.includes('ADMIN') ?? false)
    );
  }

  logout(): void {
    this.authService.logout();
  }
}