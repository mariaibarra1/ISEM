import { Injectable } from '@angular/core';
import { WebStorageService } from './web-storage.service';
import { MainService } from './main.service';
import { UsuarioModel } from '../../@auditorias/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  constructor(
    private webStorageService: WebStorageService
  ) {

  }

  setJsonValue(key: string, value: any) {

    this.webStorageService.secureStorage.setItem(key, value);
  }

  getJsonValue(key: string) {

    return this.webStorageService.secureStorage.getItem(key);
  }

  clearToken() {

    return this.webStorageService.secureStorage.clear();
  }

  guardarUsuarioActual(usuario: UsuarioModel) {
    return localStorage.setItem("usuario", JSON.stringify(usuario));
  }

}
