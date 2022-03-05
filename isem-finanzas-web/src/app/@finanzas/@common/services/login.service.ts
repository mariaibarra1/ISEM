import { Injectable } from '@angular/core';
import { WebStorageService } from './web-storage.service';
import { MainService } from './main.service';
import { UsuarioModel } from '../../@auditorias/models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends MainService {

    public async IniciarSeccionAsync(uri: string, objeto: any) {
        return await this.postAsync(this.commonBaseURL + uri, objeto);
    }
}
