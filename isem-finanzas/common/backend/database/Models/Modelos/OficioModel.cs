using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class OficioModel
    {
        public int? id_oficio { get; set; }
        public int? id_auditoria { get; set; }
        public string num_oficio { get; set; }
        public string fecha_recepcion { get; set; }
        public string fecha_cumplimiento { get; set; }
        public int? id_area_remitente { get; set; }
        public int? id_persona_remitente { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
        public string folio_auditoria { get; set; }
        public string nombre_auditoria { get; set; }
        public string nombre_area_remitente { get; set; }
        public string nombre_persona_remitente { get; set; }
        public int? id_estatus { get; set; }
        public string nombre_estatus { get; set; }
        public int? id_usuario_oficio { get; set; }
        public string nombre_usuario_oficio { get; set; }
        [NotMapped] public bool? solicitar_prorroga { get; set; }
        [NotMapped] public int? id_usuario_busqueda { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}

