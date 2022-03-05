import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class UsuarioService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar(filtro: string) {
    return this.getAsync(this.commonBaseURL + 'usuarios/consultar'+filtro);
  }

    agregar(usuario: UsuarioModel) {
      return this.postAsync(this.commonBaseURL + 'usuarios/agregar', usuario);
    }
}
