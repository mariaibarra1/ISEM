import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MainService} from '../../@common/services/main.service';
import {OficioModel} from '../models/oficio.model';

@Injectable({
  providedIn: 'root'
})
export class OficioService extends MainService {

  constructor(public http: HttpClient) {
    super(http);
  }

  consultar(filtro: string) {
    return this.getAsync(this.auditoriasBaseURL + 'oficios/consultar' + filtro);
    //return this.getAsync('https://localhost:44334/' + 'api/oficios/consultar' + filtro);
  }

  agregar(objeto: OficioModel) {
    return this.postAsync(this.auditoriasBaseURL + 'oficios/agregar', objeto);
    //return this.postAsync('https://localhost:44334/' + 'api/oficios/agregar', objeto);
  }

  modificar(objeto: OficioModel) {
    return this.putAsync(this.auditoriasBaseURL + 'oficios/modificar', objeto);
    //return this.putAsync('https://localhost:44334/' + 'api/oficios/modificar', objeto);
  }

  eliminar() {
    //return this.deleteAsync(this.auditoriasBaseURL + 'oficios/liminar');
  }

}
