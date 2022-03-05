using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaAreaNegocio : CRUD<CaAreaModel>
    {
        private CaAreaDatos datos = new CaAreaDatos();

        public ResponseGeneric<List<CaAreaModel>> Consultar(CaAreaModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaAreaModel model)
        {
            return datos.Operacion(model);
        }
    }
}
