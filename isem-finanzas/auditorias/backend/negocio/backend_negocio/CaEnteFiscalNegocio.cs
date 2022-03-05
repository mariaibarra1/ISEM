using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaEnteFiscalNegocio : CRUD<CaEnteFiscalModel>
    {
        private CaEnteFiscalDatos datos = new CaEnteFiscalDatos();

        public ResponseGeneric<List<CaEnteFiscalModel>> Consultar(CaEnteFiscalModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaEnteFiscalModel model)
        {
            return datos.Operacion(model);
        }
    }
}