using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class RequerimientoAsignadoModel
    {
        public long? id_requerimiento_asignado { get; set; }
        public long? id_requerimiento { get; set; }
        public long? id_asignado { get; set; }
        public string fecha_asignacion { get; set; }
        public string fecha_cancelacion { get; set; }
        public bool? aceptado { get; set; }
        public string fecha_atendido_requerimiento { get; set; }
        public bool? atendido_requerimiento { get; set; }
        public string fecha_atendido_observacion { get; set; }
        public bool? atendido_observacion { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int? accion { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
