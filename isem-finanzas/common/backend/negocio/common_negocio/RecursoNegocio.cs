using System;
using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace common_negocio
{
    public class RecursoNegocio : CRUD<RecursoModel>
    {
        private RecursosDatos datos = new RecursosDatos();

        public ResponseGeneric<List<RecursoModel>> Consultar(RecursoModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(RecursoModel model)
        {
            return datos.Operacion(model);
        }
    }
}