import { Injectable } from '@angular/core';
import { MainService } from '../../../@common/services/main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuficienciaModel } from '../models/suficiencia.model';
import { map } from 'rxjs/operators';
import { ObservacionModel } from '../models/observacion.model';

@Injectable({
  providedIn: 'root'
})
export class ObservacionService extends MainService {

  public async guardarAsync(uri: string, objeto: ObservacionModel) {
    return await this.postAsync(this.commonBaseURL + uri, objeto);
    //return await this.postAsync('https://localhost:44376/api/' + uri, objeto);
  }

  public async consultarAsync(uri: string) {
    return await this.getAsync(this.commonBaseURL + uri);
    //return await this.getAsync('https://localhost:44376/api/' + uri);
  }

}
