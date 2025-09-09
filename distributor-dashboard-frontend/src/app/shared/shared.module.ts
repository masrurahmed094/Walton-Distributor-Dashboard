import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [
    // All components that are part of this shared module.
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    // CommonModule is required for basic Angular directives.
    CommonModule,
    // RouterModule is needed because the HeaderComponent uses the routerLink directive.
    RouterModule
  ],
  exports: [
    // We export these components so that other modules that import the SharedModule
    // can use them in their own templates.
    HeaderComponent,
    LayoutComponent
  ]
})
export class SharedModule { }