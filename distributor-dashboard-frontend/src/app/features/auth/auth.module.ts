import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';

// Defines the routes specific to the authentication feature.
const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'forgot-password', component: ForgotPasswordFormComponent },
  // Redirects the base '/auth' path to the login page by default.
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // All components that belong to this module are declared here.
    LoginFormComponent,
    RegisterFormComponent,
    ForgotPasswordFormComponent
  ],
  imports: [
    // CommonModule is required for basic Angular directives like *ngIf.
    CommonModule,
    // ReactiveFormsModule is required because all our auth forms are reactive.
    ReactiveFormsModule,
    // RouterModule.forChild() configures the router for this feature module.
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }