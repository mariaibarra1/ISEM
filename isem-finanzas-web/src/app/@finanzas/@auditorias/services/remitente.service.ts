import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RemitenteModel } from '../models/remitente.model';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class RemitenteService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar(filtro: string) {
        return this.getAsync(this.commonBaseURL + 'catalogos/remitentes/consultar' + filtro);
    }
}
