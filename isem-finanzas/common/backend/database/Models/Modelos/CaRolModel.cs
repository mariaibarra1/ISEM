using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaRolModel
    {
        public long? id_rol { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
