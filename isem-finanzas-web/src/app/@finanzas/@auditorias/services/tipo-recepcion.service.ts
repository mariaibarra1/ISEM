import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoRecepcionModel } from '../models/tipo-recepcion.model';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class TipoRecepcionService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar() {
        return this.getAsync(this.auditoriasBaseURL + 'catalogos/tiposRecepcion/Consultar');
    }

}
