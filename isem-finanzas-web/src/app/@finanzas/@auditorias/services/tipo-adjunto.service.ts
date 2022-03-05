import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoAdjuntoModel } from '../models/tipo-adjunto.model';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class TipoAdjuntoService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar() {
        return this.getAsync(this.auditoriasBaseURL + 'catalogos/TiposAnexo/Consultar');
    }

}
