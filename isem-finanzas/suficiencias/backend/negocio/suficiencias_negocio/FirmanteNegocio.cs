using System;
using System.Collections.Generic;
using suficiencias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace suficiencias_negocio
{
    public class FirmanteNegocio
    {
        private FirmanteDatos datos = new FirmanteDatos();

        public ResponseGeneric<List<FirmanteModel>> Consultar(FirmanteModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(FirmanteModel model)
        {
            return datos.Operacion(model);
        }
    }
}
