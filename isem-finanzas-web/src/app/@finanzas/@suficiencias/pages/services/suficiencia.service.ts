import { Injectable } from '@angular/core';
import { MainService } from '../../../@common/services/main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuficienciaModel } from '../models/suficiencia.model';
import { map } from 'rxjs/operators';
import { FirmantesOficio } from '../models/tipo-oficio.model';

@Injectable({
  providedIn: 'root'
})
export class SufienciaService extends MainService {

  public async guardarAsync(uri: string, objeto: SuficienciaModel) {
    return await this.postAsync(this.suficienciasBaseURL + uri, objeto);
  }

  public async consultarAsync(uri: string) {
    return await this.getAsync(this.suficienciasBaseURL + uri);
  }

  public async BusquedaAsync(uri: string, objeto: SuficienciaModel) {
    return await this.postAsync(this.suficienciasBaseURL + uri, objeto);
  }

  public async ModificarAsync(uri: string, objeto: SuficienciaModel) {
    return await this.putAsync(this.suficienciasBaseURL + uri, objeto);
  }

  guardarFirmantes(objeto: FirmantesOficio ) {
    return this.postAsync (this.suficienciasBaseURL + 'firmante/agregar', objeto);
  }

  
}
