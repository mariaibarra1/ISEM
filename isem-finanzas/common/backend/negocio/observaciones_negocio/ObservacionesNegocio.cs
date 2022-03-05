using System;
using System.Collections.Generic;
using observaciones_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;


namespace observaciones_negocio
{
    public class ObservacionesNegocio : CRUD<ObservacionModel>
    {
        private ObservacionesDatos datos = new ObservacionesDatos();

        public ResponseGeneric<List<ObservacionModel>> Consultar(ObservacionModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(ObservacionModel model)
        {
            return datos.Operacion(model);
        }
    }
}
