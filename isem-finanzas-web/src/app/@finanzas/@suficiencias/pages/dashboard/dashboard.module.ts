import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { ThemeConstants } from '../../../../@espire/shared/config/theme-constant';
import { SuficienciaFormComponent } from './suficiencia-form/suficiencia-form.component';
import { NgbPopoverModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SufienciaService } from '../services/suficiencia.service';
import { RemitenteService } from '../services/remitente.service';
import { RecursoService } from '../services/recurso.service';
import { TipoOficioService } from '../services/tipo-oficio.service';

import { NgxCurrencyModule } from 'ngx-currency';
import { ToastsContainer } from '../../../@common/pages/Toast/toasts-container.component';
import { ToastService } from '../../../@common/services/toast-service';
import { ToastModule } from '../../../@common/pages/Toast/toast.module';
import { VerAdjuntosModule } from '../../../@common/pages/verAdjuntos/verAdjuntos.module';
import { UsuarioService } from 'src/app/@finanzas/@auditorias/services/usuario.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'agregar',
    component: SuficienciaFormComponent
  },
  {
    path: 'Visualizar/:id',
    component: SuficienciaFormComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    SuficienciaFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgbPopoverModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    NgxCurrencyModule,
    ToastModule,
    VerAdjuntosModule
  ],
  providers: [
    ThemeConstants,
    SufienciaService,
    RemitenteService,
    RecursoService,
    UsuarioService,
    ToastService,
    TipoOficioService
  ]
})
export class DashboardModule {
}
