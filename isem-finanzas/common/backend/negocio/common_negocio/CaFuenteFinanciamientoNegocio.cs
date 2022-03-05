using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaFuenteFinanciamientoNegocio : CRUD<CaFuenteFinanciamientoModel>
    {
        private CaFuenteFinanciamientoDatos datos = new CaFuenteFinanciamientoDatos();
        public ResponseGeneric<List<CaFuenteFinanciamientoModel>> Consultar(CaFuenteFinanciamientoModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaFuenteFinanciamientoModel model)
        {
            return datos.Operacion(model);
        }
    }
}
