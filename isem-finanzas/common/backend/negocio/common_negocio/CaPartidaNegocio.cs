using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaPartidaNegocio : CRUD<CaPartidaModel>
    {
        private CaPartidaDatos datos = new CaPartidaDatos();
        public ResponseGeneric<List<CaPartidaModel>> Consultar(CaPartidaModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaPartidaModel model)
        {
            return datos.Operacion(model);
        }
    }
}
