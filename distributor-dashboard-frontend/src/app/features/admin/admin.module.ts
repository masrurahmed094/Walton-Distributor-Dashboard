import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminPageComponent } from './admin-page/admin-page.component';
import { UserListComponent } from './components/user-list/user-list.component';

// Defines the routes specific to the admin feature module.
const routes: Routes = [
  {
    // The path is empty because '/admin' is defined in the main app-routing module.
    // This makes AdminPageComponent the default component for the /admin route.
    path: '',
    component: AdminPageComponent
  }
];

@NgModule({
  declarations: [
    // All components that are part of this module must be declared here.
    AdminPageComponent,
    UserListComponent
  ],
  imports: [
    // CommonModule is required for common directives like *ngIf and *ngFor.
    CommonModule,
    // RouterModule.forChild() is used for feature modules.
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }