import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { VerAdjuntosComponent } from '../verAdjuntos/verAdjuntos.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PdfViewerModule
  ],
  declarations: [
    VerAdjuntosComponent
  ],
  exports: [
    VerAdjuntosComponent
  ]
})

export class VerAdjuntosModule { }
