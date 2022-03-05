using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaAreaModel
    {
        public long? id_area { get; set; }
        public long? id_tipo_area { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
