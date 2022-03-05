export class TipoOficioModel {
    id_tipo_oficio?: number;
    id_modulo?: number;
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}

export class FirmantesOficio{
    id_suficiencia?: number;
    id_tipo_oficio?: number;
    nombre_solicitante?: string;
    puesto_solicitante?: string;
    id_elaboro?: number;
    id_reviso?: number;
    id_valido?: number;
}
