using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
   public  class CaTipoSuficienciaModel
    {
        public long? id_tipo_suficiencia { get; set; }
      public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
       [NotMapped] public int tipoOperacion { get; set; }
    }
}
