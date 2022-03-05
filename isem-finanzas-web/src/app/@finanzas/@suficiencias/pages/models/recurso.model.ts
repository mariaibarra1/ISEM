export class RecursoModel {

  id_fuente_financiamiento?: number;
  clave?: string;
  nombre?: string;
  activo?: boolean;
  monto?: number;


}



export class Fuentefinanciamiento {

  id_suficiencia: number;
  id_fuente_financiamiento: number;
  monto: number;
  id_partida: number;
  descripcion: string;

}