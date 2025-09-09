import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileEditFormComponent } from './components/profile-edit-form/profile-edit-form.component';

// Defines the routes specific to the profile feature module.
const routes: Routes = [
  {
    // The path is empty because '/profile' is defined in the main app-routing module.
    // This makes ProfilePageComponent the default component for the /profile route.
    path: '',
    component: ProfilePageComponent
  }
];

@NgModule({
  declarations: [
    // All components that are part of this module must be declared here.
    ProfilePageComponent,
    ProfileDetailsComponent,
    ProfileEditFormComponent
  ],
  imports: [
    // CommonModule is required for common directives like *ngIf and *ngFor.
    CommonModule,
    // ReactiveFormsModule is required for the profile edit form.
    ReactiveFormsModule,
    // RouterModule.forChild() is used for feature modules.
    RouterModule.forChild(routes)
  ]
})
export class ProfileModule { }