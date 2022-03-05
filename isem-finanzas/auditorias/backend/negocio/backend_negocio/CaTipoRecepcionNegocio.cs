using System;
using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaTipoRecepcionNegocio : CRUD<CaTipoRecepcionModel>
    {
        private CaTipoRecepcionDatos datos = new CaTipoRecepcionDatos();

        public ResponseGeneric<List<CaTipoRecepcionModel>> Consultar(CaTipoRecepcionModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaTipoRecepcionModel model)
        {
            return datos.Operacion(model);
        }
    }
}