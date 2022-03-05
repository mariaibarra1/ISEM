using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using suficiencias_acceso_datos;
using System;
using System.Collections.Generic;
using System.Text;

namespace suficiencias_negocio
{
    public class SuficienciaNegocio : CRUD<SuficienciaModel>
    {
        private SuficienciaDatos datos = new SuficienciaDatos();

        public ResponseGeneric<List<SuficienciaModel>> Consultar(SuficienciaModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(SuficienciaModel model)
        {
            return datos.Operacion(model);
        }
    }
}
