import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsContainer } from './toasts-container.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
   ToastsContainer
  ],
  exports: [
    ToastsContainer
  ]
})

export class ToastModule {
}
