using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class RequerimientoAsignadoNegocio : CRUD<RequerimientoAsignadoModel>
    {
        private RequerimientoAsignadoDatos datos = new RequerimientoAsignadoDatos();

        public Response Operacion(RequerimientoAsignadoModel model)
        {
            return datos.Operacion(model);
        }

        public ResponseGeneric<List<RequerimientoAsignadoModel>> Consultar(RequerimientoAsignadoModel model)
        {
            return datos.Consultar(model);
        }

    
    }
}