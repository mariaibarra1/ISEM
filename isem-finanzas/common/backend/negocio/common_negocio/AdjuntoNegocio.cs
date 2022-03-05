using System;
using System.Collections.Generic;
using Models.Modelos;
using Models.Response;
using Models.Interfaz;
using AccesoDatos;

namespace common_negocio.Negocio
{
    public class AdjuntoNegocio : CRUD<AdjuntoModel>
    {
        private AdjuntoDatos datos = new AdjuntoDatos();

        public ResponseGeneric<List<AdjuntoModel>> Consultar(AdjuntoModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(AdjuntoModel model)
        {
            return datos.Operacion(model);
        }
    }
}