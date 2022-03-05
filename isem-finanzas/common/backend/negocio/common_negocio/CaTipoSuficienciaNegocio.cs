using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace common_negocio
{
    public class CaTipoSuficienciaNegocio : CRUD<CaTipoSuficienciaModel>
    {
        private CaTipoSuficienciaDatos datos = new CaTipoSuficienciaDatos();

        public ResponseGeneric<List<CaTipoSuficienciaModel>> Consultar(CaTipoSuficienciaModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaTipoSuficienciaModel model)
        {
            return datos.Operacion(model);
        }

    }
}
