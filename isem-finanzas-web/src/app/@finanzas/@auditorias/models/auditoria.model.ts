import { RequerimientoModel } from './requerimiento.model';

export class AuditoriaModel {
  id_auditoria?: number;
  ejercicio?: number;
  fecha_recepcion?: string;
  fecha_cumplimiento?: string;
  inicio_revision?: string;
  fin_revision?: string;
  id_fiscal?: number;
  id_area_remitente?: number;
  id_remitente?: number;
  //num_oficio?: string;
  folio?: string;
  activo?: boolean;
  id_tipo_recepcion?: number;
  id_estatus?: number;
  descripcion?: string;
  nombre_auditoria?: string;
  num_auditoria?: string;
  fiscal_nombre?: string;
  area_nombre?: string;
  remitente_nombre?: string;
  tipo_recepcion?: string;
  estatus_nombre?: string;
  id_usuario_busqueda?: number;
  dias_restantes?: number;
  //lista_requerimientos?: string;
}
