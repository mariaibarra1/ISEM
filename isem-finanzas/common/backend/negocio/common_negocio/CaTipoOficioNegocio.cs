using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace common_negocio
{
    public class CaTipoOficioNegocio : CRUD<CaTipoOficioModel>
    {
        private CaTipoOficioDatos datos = new CaTipoOficioDatos();

        [System.Obsolete]
        public ResponseGeneric<List<CaTipoOficioModel>> Consultar(CaTipoOficioModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaTipoOficioModel model)
        {
            return datos.Operacion(model);
        }
    }
}
