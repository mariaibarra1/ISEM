using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class RequerimientoModel
    {
        public int? id_requerimiento { get; set; }
        public int? id_oficio { get; set; }
        public int? id_auditoria { get; set; }
        //[NotMapped] public int? id_asignado { get; set; }
        public string descripcion { get; set; }
        public string fecha_recepcion { get; set; }
        //public string fecha_asignacion { get; set; }
        public bool? activo { get; set; }
        public string num_oficio { get; set; }
    // public string nombre_asignado { get; set; }
        public int? id_estatus { get; set; }
        public string nombre_estatus { get; set; }
        public int? id_usuario_requerimiento { get; set; }
        public string nombre_usuario_requerimiento { get; set; }
        public string lista_asignados { get; set; }
        public int? id_requerimiento_asignado { get; set; }
        public bool? aceptado { get; set; }
        [NotMapped] public string observaciones { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }

}
