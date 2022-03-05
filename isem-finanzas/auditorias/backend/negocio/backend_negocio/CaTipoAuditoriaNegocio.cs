using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaTipoAuditoriaNegocio : CRUD<CaTipoAuditoriaModel>
    {
        private CaTipoAuditoriaDatos datos = new CaTipoAuditoriaDatos();

        public ResponseGeneric<List<CaTipoAuditoriaModel>> Consultar(CaTipoAuditoriaModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaTipoAuditoriaModel model)
        {
            return datos.Operacion(model);
        }
    }
}
