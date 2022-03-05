import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class SuficienciaModel {


  id_suficiencia?: number;
  id_partida?: number;
  nombre_partida?: string;
  id_fuente_financiamiento?: number;
  nombre_fuente?: string;
  id_estatus?: number;
  nombre_estatus?: string;
  id_area?: number;
  nombre_area?: string;
  folio?: string;
  asunto?: string;
  monto_solicitado?: number;
  montoFF?: number;
  fecha_limite?: string;
  fecha_recepcionfront?: NgbDate;
  fecha_Limitefront?: NgbDate;
  fecha_liberacionfront?: NgbDate;
  fecha_recepcion?: string;
  fecha_liberacion?: string;
  observacion?: string;
  fuentes_financiamiento?: string;
  fecha_turno?: string;
  fecha_turnadoFront?: NgbDate;
  sp?: string;
  monto_adjudicado?: number;
  num_contrato?: string;
  monto_suficiencia?: number;
  id_usuario?: number;
  id_usuario_estatus?: number;
  id_tipo_suficiencia?: number;
  num_cheque?: number;
  monto_cheque?: number;
  banco_expedicion?: string;
  asignacion_Presupuesto?: number;
}
