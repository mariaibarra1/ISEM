using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class AuditoriaModel
    {
        public int? id_auditoria { get; set; }
        public int? ejercicio { get; set; }
        public string fecha_recepcion { get; set; }
        public string fecha_cumplimiento { get; set; }
        public string inicio_revision { get; set; }
        public string fin_revision { get; set; }
        public int? id_fiscal { get; set; }
        public int? id_area_remitente { get; set; }
        public int? id_remitente { get; set; }
        public string folio { get; set; }
        public bool? activo { get; set; }
        public int? id_tipo_recepcion { get; set; }
        public int? id_estatus { get; set; }
        public string descripcion { get; set; }
        public string nombre_auditoria { get; set; }
        public string num_auditoria { get; set; }
        public string fiscal_nombre { get; set; }
        public string area_nombre { get; set; }
        public string remitente_nombre { get; set; }
        public string tipo_recepcion { get; set; }
        public string estatus_nombre { get; set; }
        [NotMapped] public int? id_usuario_busqueda { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }

}
