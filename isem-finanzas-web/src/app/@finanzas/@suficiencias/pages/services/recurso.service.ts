import { Injectable } from '@angular/core';
import { MainService } from '../../../@common/services/main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RecursoModel } from '../models/recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService extends MainService {

  public async consultarAsync(uri: string) {
    return await this.getAsync(this.commonBaseURL + uri);
  }
}
