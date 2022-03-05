using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaRubroNegocio : CRUD<CaRubroModel>
    {
        private CaRubroDatos datos = new CaRubroDatos();

        public ResponseGeneric<List<CaRubroModel>> Consultar(CaRubroModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaRubroModel model)
        {
            return datos.Operacion(model);
        }
    }
}