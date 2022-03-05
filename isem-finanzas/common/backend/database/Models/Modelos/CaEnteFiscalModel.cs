using System.ComponentModel.DataAnnotations.Schema;

namespace Models.Modelos
{
    public class CaEnteFiscalModel
    {
        public long? id_fiscal { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool? activo { get; set; }
        [NotMapped] public int tipoOperacion { get; set; }
    }
}