
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainService } from '../../../@common/services/main.service';
import { TipoOficioModel } from '../models/tipo-oficio.model';
import { environment } from '../../../../../environments/environment';
import { identity } from 'rxjs';


@Injectable()

export class TipoOficioService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar() {
        return this.getAsync(this.commonBaseURL + 'catalogos/CaTipoOficio/Consultar');
    }

    
    generarOficiosJasper(tipoOficio: string, IdSuficiencia:number) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(environment.credencialesJasper))
      .set('Content-Type', 'application/json');

    let reportURL = this.suficienciasBaseURL + 'reportes' + environment.jasper_server + tipoOficio + '?IdSuficiencia=' + IdSuficiencia;
    console.log(reportURL);
    return this.http.get(reportURL, {responseType: 'blob', headers});
  }
}
