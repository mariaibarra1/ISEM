import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AltaUsuariosComponent } from './altaUsuarios.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast-service';
import { ToastModule } from '../Toast/toast.module';
import { UsuarioService } from '../../../@auditorias/services/usuario.service';
import { RolService } from '../../services/rol.service';

const routes: Routes = [
  {
    path: '',
    component: AltaUsuariosComponent
  }
];

@NgModule({
  declarations: [
    AltaUsuariosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToastModule
  ],
  providers: [
    ToastService,
    UsuarioService,
    RolService
  ]
})
export class AltaUsuariosModule {
}
