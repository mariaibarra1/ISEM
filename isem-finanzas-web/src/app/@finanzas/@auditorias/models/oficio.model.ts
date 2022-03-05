export class OficioModel {
  id_oficio?: number;
  id_auditoria?: number;
  num_oficio?: string;
  fecha_recepcion?: string;
  fecha_cumplimiento?: string;
  id_area_remitente?: number;
  id_persona_remitente?: number;
  descripcion?: string;
  activo?: boolean;
  folio_auditoria?: string;
  nombre_auditoria?: string;
  nombre_area_remitente?: string;
  nombre_persona_remitente?: string;
  id_usuario_oficio?: number;
  nombre_usuario_oficio?: string;
  id_estatus?: number;
  nombre_estatus?: string;
  solicitar_prorroga?: boolean;
  id_usuario_busqueda?: number;
}
