using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaRubroModel
    {
        public long? id_rubro { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}