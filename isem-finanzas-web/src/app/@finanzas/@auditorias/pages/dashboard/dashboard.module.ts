import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeConstants } from '../../../../@espire/shared/config/theme-constant';
import { AuditoriaFormComponent } from './auditoria-form/auditoria-form.component';

import {VerAdjuntosModule} from '../../../@common/pages/verAdjuntos/verAdjuntos.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnteFiscalService } from '../../services/ente-fiscal.service';
import { RemitenteService } from '../../services/remitente.service';
import { TipoAdjuntoService } from '../../services/tipo-adjunto.service';
import { TipoRecepcionService } from '../../services/tipo-recepcion.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuditoriaService } from '../../services/auditoria.service';
import { AdjuntoService } from '../../services/adjunto.service';
import { ToastService } from '../../../@common/services/toast-service';
import { ToastModule } from '../../../@common/pages/Toast/toast.module';
import { OficioFormComponent } from './oficio-form/oficio-form.component';
import { ProrrogaFormComponent } from './prorroga-form/prorroga-form.component';
import { RequerimientosFormComponent } from './requerimientos-form/requerimientos-form.component';



const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'agregar',
    component: AuditoriaFormComponent
  },
  {
    path: 'editar',
    component: AuditoriaFormComponent

  },
  {
    path: 'agregarOficio',
    component: OficioFormComponent

  },
  {
    path: 'editarOficio',
    component: OficioFormComponent
  },
  {
    path: 'agregarRequerimiento',
    component: RequerimientosFormComponent
  },
  {
    path: 'editarRequerimiento',
    component: RequerimientosFormComponent

  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AuditoriaFormComponent,
    RequerimientosFormComponent,
    OficioFormComponent,
    ProrrogaFormComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTablesModule,
    NgbPopoverModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    VerAdjuntosModule,
    ToastModule
  ],
  providers: [
    ThemeConstants,
    EnteFiscalService,
    RemitenteService,
    TipoAdjuntoService,
    TipoRecepcionService,
    UsuarioService,
    AuditoriaService,
    AdjuntoService,
    ToastService
  ]
})
export class DashboardModule {
}
