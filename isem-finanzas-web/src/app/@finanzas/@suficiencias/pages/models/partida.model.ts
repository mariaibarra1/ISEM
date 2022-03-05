export class PartidaModel {
    id_partida: number;
    partida: number;
    concepto: string;
    activo: boolean;
    monto_max_real: number;
    monto_modificado: number;
    id_fuente_financiamiento: number;


}


export class PartidaFF {
    id_suficiena: number;
    id_partida: number;
    concepto_partida: string;
    id_fuente_financiamiento?: number;
    fuente_financiamiento?: string;
    monto: number;
    descripcion: string;
    monto_modificado?: number;
    monto_adjudicado?: number;
}