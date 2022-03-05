using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class Login
    {
        public string usuario { get; set; }
        public string contrasenia { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}
