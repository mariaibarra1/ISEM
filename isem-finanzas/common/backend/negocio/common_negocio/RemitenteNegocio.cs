using System;
using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace common_negocio
{
    public class RemitenteNegocio : CRUD<RemitenteModel>
    {
        private RemitenteDatos datos = new RemitenteDatos();

        public ResponseGeneric<List<RemitenteModel>> Consultar(RemitenteModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(RemitenteModel model)
        {
            return datos.Operacion(model);
        }
    }
}