using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class ObservacionModel
    {
        public long? id_observacion { get; set; }
        public long? id_auditoria { get; set; }
        public long? id_requerimiento { get; set; }
        public long? id_suficiencia { get; set; }
        public string observacion { get; set; }
        public string fecha_creacion { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
