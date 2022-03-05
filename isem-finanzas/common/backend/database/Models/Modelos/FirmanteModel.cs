using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class FirmanteModel
    {
        public long? id_suficiencia { get; set; }
        public long? id_elaboro { get; set; }
        public long? id_reviso { get; set; }
        public long? id_valido { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
