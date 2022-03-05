using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class AdjuntoModel
    {
        public long? id_adjunto { get; set; }
        public string nombre { get; set; }
        public string tamanio { get; set; }
        public string fecha_carga { get; set; }
        public long? id_tipo_adjunto { get; set; }
        public string tipo_nombre { get; set; }
        public bool? activo { get; set; }
        public long? id_requerimiento_auditoria { get; set; }
        public long? id_suficiencia { get; set; }
        public long? id_oficio { get; set; }
        [NotMapped]
        public int tipoOperacion { get; set; }
    }
}
