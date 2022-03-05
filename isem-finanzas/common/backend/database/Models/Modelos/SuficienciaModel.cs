using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class SuficienciaModel
    {
        public int? id_suficiencia { get; set; }
        public int? id_area { get; set; }
        public string nombre_area { get; set; }
        public string fecha_recepcion { get; set; }
        public string sp { get; set; }
        public string asunto { get; set; }
        public decimal? monto_solicitado { get; set; }
        public decimal? monto_suficiencia { get; set; }
        public decimal? monto_adjudicado { get; set; }
        public string num_contrato { get; set; }
        public string folio { get; set; }
        public string fecha_liberacion { get; set; }
        public string fecha_limite { get; set; }
        public string fecha_turno { get; set; }
        public int? id_estatus { get; set; }
        public string nombre_estatus { get; set; }
        public string observacion { get; set; }
        public string fuentes_financiamiento { get; set; }
        public int? id_usuario { get; set; }

        public int? id_usuario_estatus { get; set; }
        public int? id_tipo_suficiencia { get; set; }


        public int? num_cheque { get; set; }

        public decimal? monto_cheque { get; set; }

        public string banco_expedicion { get; set; }

        public int? asignacion_Presupuesto { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
