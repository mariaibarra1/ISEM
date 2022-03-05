using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class RequerimientoNegocio : CRUD<RequerimientoModel>
    {
        private RequerimientoDatos datos = new RequerimientoDatos();

        public Response Operacion(RequerimientoModel model)
        {
            return datos.Operacion(model);
        }

        public ResponseGeneric<List<RequerimientoModel>> Consultar(RequerimientoModel model)
        {
            return datos.Consultar(model);
        }

    
    }
}