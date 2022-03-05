using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models.Modelos
{
    public class CaFuenteFinanciamientoModel
    {
        public long? id_fuente_financiamiento { get; set; }
        public long? clave { get; set; }
        public string nombre { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
