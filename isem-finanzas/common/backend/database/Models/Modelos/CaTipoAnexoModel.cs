using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaTipoAnexoModel
    {
        public int? id_tipo_adjunto { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }

}
