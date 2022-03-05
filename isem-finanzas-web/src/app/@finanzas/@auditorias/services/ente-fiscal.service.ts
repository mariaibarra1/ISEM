import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnteFiscalModel } from '../models/ente-fiscal.model';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class EnteFiscalService extends MainService {

    constructor(public http: HttpClient) {
        super(http);
    }

    consultar() {
        return this.getAsync(this.auditoriasBaseURL + 'catalogos/EntesFiscales/Consultar');
    }
}
