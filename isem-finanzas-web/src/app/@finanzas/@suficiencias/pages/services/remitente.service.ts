import { Injectable } from '@angular/core';
import { MainService } from '../../../@common/services/main.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemitenteService extends MainService {

  public async consultarAsync(uri: string) {
    return await this.getAsync(this.commonBaseURL + uri);
  }
}
