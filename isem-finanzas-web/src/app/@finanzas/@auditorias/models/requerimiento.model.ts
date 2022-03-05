export class RequerimientoModel {
  id_requerimiento?: number;
  id_oficio?: number;
  id_auditoria?: number;
  //id_asignado?: number;
  descripcion?: string;
  fecha_recepcion?: string;
  //fecha_asignacion?: string;
  activo?: boolean;
  num_oficio?: string;
  //nombre_asignado?: string;
  id_estatus?: number;
  nombre_estatus?: string;
  id_usuario_requerimiento?: number;
  nombre_usuario_requerimiento?: string;
  lista_asignados?: string;
  observaciones?: string;
  accion?: string;
  asignados?: string;
  id_requerimiento_asignado?: number;
  aceptado?: boolean;
}


