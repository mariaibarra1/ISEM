using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class ParametroModel
    {
        public long? id_parametro { get; set; }
       public decimal? monto { get; set; }
       public bool? activo { get; set; }
       [NotMapped] public int tipoOperacion { get; set; }
    }
}
