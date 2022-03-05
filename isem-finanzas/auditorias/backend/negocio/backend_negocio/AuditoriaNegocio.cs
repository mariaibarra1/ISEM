using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class AuditoriaNegocio : CRUD<AuditoriaModel>
    {
        private AuditoriaDatos datos = new AuditoriaDatos();

        public Response Operacion(AuditoriaModel model)
        {
            return datos.Operacion(model);
        }

        public ResponseGeneric<List<AuditoriaModel>> Consultar(AuditoriaModel model)
        {
            return datos.Consultar(model);
        }
    }
}