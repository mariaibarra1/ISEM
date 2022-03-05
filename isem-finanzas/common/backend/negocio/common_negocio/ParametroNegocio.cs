using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace common_negocio
{
    public class ParametroNegocio : CRUD<ParametroModel>
    {
        private ParametroDatos datos = new ParametroDatos();

       public ResponseGeneric<List<ParametroModel>> Consultar(ParametroModel model)
       {
           return datos.Consultar(model);
       }

       public Response Operacion(ParametroModel model)
       {
           return datos.Operacion(model);
       }

    }
}
