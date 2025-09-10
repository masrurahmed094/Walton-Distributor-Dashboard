import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';

// --- IMPORT THE NEW PIPE ---
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    // All components that are part of this shared module.
    HeaderComponent,
    LayoutComponent,
    // --- ADD THE PIPE TO DECLARATIONS ---
    SafeHtmlPipe
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
    LayoutComponent,
    // --- ALSO ADD THE PIPE TO EXPORTS ---
    SafeHtmlPipe
  ]
})
export class SharedModule { }

