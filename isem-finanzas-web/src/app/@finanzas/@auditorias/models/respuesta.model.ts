export interface RespuestaModel {
  exito: boolean;
  mensaje: string;
  respuesta: any;
}

export interface IRespuestaConsulta {
  response: Array<any>;
  success: boolean;
  status: number;
  currentException: any;
}
