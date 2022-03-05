using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class OficioNegocio : CRUD<OficioModel>
    {
        private OficioDatos datos = new OficioDatos();

        public Response Operacion(OficioModel model)
        {
            return datos.Operacion(model);
        }

        public ResponseGeneric<List<OficioModel>> Consultar(OficioModel model)
        {
            return datos.Consultar(model);
        }
    }
}