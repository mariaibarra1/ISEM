import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../../@common/services/main.service';

@Injectable()
export class RolService extends MainService {
  
    constructor(public http: HttpClient) {
        super(http);
    }

    consultar() {
      return this.getAsync(this.commonBaseURL  + 'catalogos/CaRol/consultar');
    }

}
