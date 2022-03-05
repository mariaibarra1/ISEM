import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MainService} from '../../@common/services/main.service';
import {AuditoriaModel} from '../models/auditoria.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService extends MainService {

  constructor(public http: HttpClient) {
    super(http);
  }

  consultar() {
    return this.getAsync(this.auditoriasBaseURL + 'auditorias/Consultar');
    //return this.getAsync('https://localhost:44334/' + 'api/auditorias/Consultar');
  }
  consultarXfiltro(filtro: string) {
    return this.getAsync(this.auditoriasBaseURL + 'auditorias/Consultar' + filtro);
    //return this.getAsync('https://localhost:44334/' + 'api/auditorias/Consultar' + filtro);
  }
  agregar(objeto: AuditoriaModel) {
    return this.postAsync(this.auditoriasBaseURL + 'auditorias/Agregar', objeto);
    //return this.postAsync('https://localhost:44334/' + 'api/auditorias/Agregar', objeto);
  }

  modificar(objeto: AuditoriaModel) {
    return this.putAsync(this.auditoriasBaseURL + 'auditorias/Modificar', objeto);
    //return this.putAsync('https://localhost:44334/' + 'api/auditorias/Modificar', objeto);
  }

  eliminar() {
    //return this.deleteAsync(this.auditoriasBaseURL + 'auditorias/Eliminar');
  }

}
