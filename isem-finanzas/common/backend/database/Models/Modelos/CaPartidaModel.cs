using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaPartidaModel
    {
        public long? id_partida { get; set; }
        public int? partida { get; set; }
        public string concepto { get; set; }
        public bool? activo { get; set; }
        public decimal? monto_max_real { get; set; }
        public decimal? monto_modificado { get; set; }
        public long? id_fuente_financiamiento { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
