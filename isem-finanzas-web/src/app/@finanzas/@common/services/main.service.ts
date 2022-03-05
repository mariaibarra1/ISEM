import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RespuestaModel} from '../../@auditorias/models/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  auditoriasBaseURL = 'http://10.2.15.40:8100/'; // URL de Gateway de Auditorías
  commonBaseURL =  'http://10.2.15.40:8200/' ; 
  suficienciasBaseURL = 'http://10.2.15.40:8300/' ;

  constructor(
    public httpClient: HttpClient
  ) {
  }

  getAsync(url: string): Promise<any> {

    return new Promise(resolve => {

      const subscription = this.httpClient.get<any>(url)
        .subscribe(
          data => {

            subscription.unsubscribe();

            resolve(data);

          }, error => {

            subscription.unsubscribe();

            resolve({
              exito: false,
              mensaje: error.message.toString(),
              respuesta: null
            } as RespuestaModel);
          });
    });
  }

  postAsync(url: string, objeto: any): Promise<any> {
    
    return new Promise(resolve => {

      const subscription = this.httpClient.post(url, objeto)
        .subscribe(
          data => {

            subscription.unsubscribe();

            resolve(data ? data : {exito: true} as RespuestaModel);
          },
          error => {

            subscription.unsubscribe();

            return resolve({
              exito: false,
              mensaje: error.message.toString(),
              respuesta: null
            } as RespuestaModel);
          });
    });
  }

  putAsync(url: string, objeto: any): Promise<any> {

    return new Promise(resolve => {

      const subscription = this.httpClient.put(url, objeto)
        .subscribe(
          data => {

            subscription.unsubscribe();

            resolve(data ? data : {exito: true} as RespuestaModel);
          },
          error => {

            subscription.unsubscribe();

            return resolve({
              exito: false,
              mensaje: error.message.toString(),
              respuesta: null
            } as RespuestaModel);
          });
    });
  }

  deleteAsync(url: string): Promise<any> {

    return new Promise(resolve => {

      const subscription = this.httpClient.delete<any>(url)
        .subscribe(
          data => {

            subscription.unsubscribe();

            resolve(data ? data : {exito: true} as RespuestaModel);

          }, error => {

            subscription.unsubscribe();

            resolve({
              exito: false,
              mensaje: error.message.toString(),
              respuesta: null
            } as RespuestaModel);
          });
    });
  }
}
