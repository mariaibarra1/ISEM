using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Models.Modelos
{
    public class UsuarioModel
    {
        public int? id_usuario { get; set; }
        public string nombre { get; set; }
        public string apellido_paterno { get; set; }
        public string apellido_materno { get; set; }
        public string correo_electronico { get; set; }
        public string contrasenia { get; set; }
        public int? id_rol { get; set; }
        public string nombre_rol { get; set; }
        public bool activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }

    }

}
