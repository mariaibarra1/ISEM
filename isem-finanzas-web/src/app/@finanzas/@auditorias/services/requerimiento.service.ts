import {Injectable, ɵConsole} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MainService} from '../../@common/services/main.service';
import { RequerimientoModel } from '../models/requerimiento.model';

@Injectable({
  providedIn: 'root'
})

export class RequerimientoService  extends MainService  {

  constructor(public http: HttpClient) {
    super(http);
  }

  consultar(filtro: string) {
    return this.getAsync(this.auditoriasBaseURL + 'requerimientos/Consultar' + filtro);
    //return this.getAsync('https://localhost:44334/' + 'api/requerimientos/consultar' + filtro);
  }

  agregar(objeto: RequerimientoModel) {
    return this.postAsync(this.auditoriasBaseURL + 'requerimientos/Agregar', objeto);
    //return this.postAsync('https://localhost:44334/' + 'api/requerimientos/Agregar', objeto);
  }

  modificar(objeto: RequerimientoModel) {
    console.log(objeto)
    return this.putAsync(this.auditoriasBaseURL + 'requerimientos/Modificar', objeto);
    //return this.putAsync('https://localhost:44334/' + 'api/requerimientos/Modificar', objeto);
  }

  eliminar(filtro: string) {
    console.log(filtro);
    return this.deleteAsync(this.auditoriasBaseURL + 'requerimientos/Eliminar' + filtro);
  }
}
