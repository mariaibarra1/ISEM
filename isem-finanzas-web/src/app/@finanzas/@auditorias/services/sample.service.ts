import {Injectable} from '@angular/core';
import {MainService} from '../../@common/services/main.service';
import {AuditoriaModel} from '../models/auditoria.model';

@Injectable({
  providedIn: 'root'
})
export class SampleService extends MainService {

  localURL = 'https://localhost:8101'; // URL local

  consultar() {

    // return this.getAsync(this.auditoriasBaseURL + 'auditorias/consultar'); // Con URL de Gateway

    return this.getAsync(this.localURL + '/api/auditorias/consultar');
  }

  guardar() {

    // return this.postAsync(this.auditoriasBaseURL + 'auditorias/guardar', new AuditoriaModel()); // Con URL de Gateway

    return this.postAsync(this.localURL + '/api/auditorias/agregar', new AuditoriaModel());
  }

  modificar() {

    // return this.putAsync(this.auditoriasBaseURL + 'auditorias/guardar', new AuditoriaModel()); // Con URL de Gateway

    return this.putAsync(this.localURL + '/api/auditorias/modificar', new AuditoriaModel());
  }

  eliminar() {

    // return this.deleteAsync(this.auditoriasBaseURL + 'auditorias/consultar'); // Con URL de Gateway

    return this.deleteAsync(this.localURL + '/api/auditorias/eliminar');
  }
}
