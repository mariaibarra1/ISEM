import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { UsuarioModel } from '../../../../@auditorias/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  public Acceso = false;
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private loginservice: LoginService
  ) {
  }

  ngOnInit(): void {
  }

  async signIn() {

    const user = {
      usuario: this.username,
      contrasenia: this.password
    };
    let data = await this.loginservice.IniciarSeccionAsync('autenticacion/iniciarsesion', user);
    if (data.status === 1) {
      this.localStorageService.setJsonValue('isem-user', user);
      this.Acceso = false;
      this.router.navigate(['/finanzas/home']);
    } else {
      this.Acceso = true;
    }

    const usuario: UsuarioModel = JSON.parse(data.respuesta);
    this.localStorageService.guardarUsuarioActual(usuario);
  }








}


