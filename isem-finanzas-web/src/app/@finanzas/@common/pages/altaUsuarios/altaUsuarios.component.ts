import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolModel } from '../../models/rol.model';
import { UsuarioModel } from '../../../@auditorias/models/usuario.model';
import { RolService } from '../../services/rol.service';
import { UsuarioService } from '../../../@auditorias/services/usuario.service';
import { ToastService } from '../../services/toast-service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-altaUsuarios',
  templateUrl: './altaUsuarios.component.html',
  styleUrls: ['./altaUsuarios.component.scss']
})
export class AltaUsuariosComponent implements OnInit {
  tittle: string;
  usuarioForm: UsuarioModel;
  listaRoles: Array<RolModel> = [];
  location: Location;

  constructor(
    location: Location,
    private router: Router,
    private rolService: RolService,
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) {
    this.location = location;
    this.usuarioForm = new UsuarioModel();
    this.tittle = "Agregar"
  }

  async ngOnInit() {
    this.listaRoles = await this.consultarRoles();
    
  }

  public async consultarRoles() {
    const respuesta: any = await this.rolService.consultar();
    return respuesta;
  }

  public async registrarUsuario(form: NgForm) {
    if (form.valid) {
      this.usuarioForm.id_usuario = 0;
      this.usuarioForm.activo = true; 

      let respuesta: any = await this.usuarioService.agregar(this.usuarioForm);

      if (respuesta) {
        if (respuesta == "1") {
          form.reset();
          this.toastService.show('Agregado Correctamente ', { classname: 'bg-success text-light', delay: 1000 });
          await delay(1200);
          this.router.navigate(['/finanzas'])
        } else {
          this.toastService.show('Error al agregar verifica los datos  ', { classname: 'bg-danger  text-light', delay: 5000 });
        }
      }
    } else {
      this.toastService.show('Formulario invalido', { classname: 'bg-danger  text-light', delay: 5000 });
    }

  }

  async prueba(form: NgForm) {
    form.reset();
    this.toastService.show('Agregado Correctamente ', { classname: 'bg-success text-light', delay: 1000});
    await delay(1200);
    this.router.navigate(['/finanzas'])
  }

  
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
