using System;
using System.Collections.Generic;
using System.Text;

namespace Models.Modelos
{
    public class ComprobarPass
    {
        public string texto_plano { get; set; }
        public string password { get; set; }
        public ComprobarPass()
        {
        }
        public ComprobarPass(string textoPlano, string password)
        {
            this.texto_plano = textoPlano;
            this.password = password;
        }
    }
}
