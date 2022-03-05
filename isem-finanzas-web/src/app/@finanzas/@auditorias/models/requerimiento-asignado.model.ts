export class ResponsableRequerimientoModel {
  id_requerimiento_asignado?: number;
  id_requerimiento?: number;
  id_asignado?: number;
  nombre_asignado?: string;
  fecha_asignacion?: string;
  fecha_cancelacion?: string;
  aceptado?: boolean;
  fecha_atendido_requerimiento?: string;
  atendido_requerimiento?: boolean;
  fecha_atendido_observacion?: string;
  atendido_observacion?: boolean;
  activo?: boolean;
  accion?: number;
}
