import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MainService} from '../../@common/services/main.service';
import { ResponsableRequerimientoModel } from '../models/requerimiento-asignado.model';

@Injectable({
  providedIn: 'root'
})
export class RequerimientoAsignadoService extends MainService {

  constructor(public http: HttpClient) {
    super(http);
  }

  consultar(filtro: string) {
    return this.getAsync(this.auditoriasBaseURL + 'requerimientosasignados/consultar' + filtro);
    //return this.getAsync('https://localhost:44334/' + 'api/requerimientosasignados/consultar' + filtro);
  }

  agregar(objeto: ResponsableRequerimientoModel) {
    return this.postAsync(this.auditoriasBaseURL + 'requerimientosasignados/agregar', objeto);
    //return this.postAsync('https://localhost:44334/' + 'api/requerimientosasignados/agregar', objeto);
  }

  modificar(objeto: ResponsableRequerimientoModel) {
    return this.putAsync(this.auditoriasBaseURL + 'requerimientosasignados/modificar', objeto);
    //return this.putAsync('https://localhost:44334/' + 'api/requerimientosasignados/modificar', objeto);
  }

  eliminar() {
    //return this.deleteAsync(this.auditoriasBaseURL + 'requerimientosasignados/liminar');
  }

}
