import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainService } from '../../@common/services/main.service';
import { AdjuntoModel } from '../models/adjunto.model';

@Injectable({
  providedIn: 'root'
})
export class AdjuntoService extends MainService {

  constructor(public http: HttpClient) {
    super(http);
  }

  consultar(filtro: string) {
    return this.getAsync(this.commonBaseURL + 'adjuntos/Consultar' + filtro);
    //return this.getAsync('https://localhost:44379/' + 'api/adjuntos/Consultar' + filtro);
}
//
  agregar(objeto: AdjuntoModel) {
    return this.postAsync(this.commonBaseURL + 'adjuntos/Agregar', objeto);
    //return this.postAsync('https://localhost:44379/' + 'api/adjuntos/Agregar', objeto);
  }

  agregarList(objeto: Array<AdjuntoModel>) {
    return this.postAsync(this.commonBaseURL + 'adjuntos/AgregarLista', objeto);
    //return this.postAsync('https://localhost:44379/' + 'api/adjuntos/AgregarLista', objeto);
  }

  verAdjunto(Archivos: AdjuntoModel[]) {
    return this.postAsync(this.commonBaseURL + 'adjuntos/verAdjunto', Archivos);
    //return this.postAsync('https://localhost:44379/' + 'api/adjuntos/verAdjunto', Archivos);
  }

}

