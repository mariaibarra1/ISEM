using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaRolNegocio : CRUD<CaRolModel>
    {
        private CaRolDatos datos = new CaRolDatos();

        public ResponseGeneric<List<CaRolModel>> Consultar(CaRolModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaRolModel model)
        {
            return datos.Operacion(model);
        }
    }
}
