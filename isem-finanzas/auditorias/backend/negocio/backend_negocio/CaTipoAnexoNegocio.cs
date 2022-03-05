using System;
using System.Collections.Generic;
using auditorias_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_negocio
{
    public class CaTipoAnexoNegocio : CRUD<CaTipoAnexoModel>
    {
        private CaTipoAnexoDatos datos = new CaTipoAnexoDatos();

        public ResponseGeneric<List<CaTipoAnexoModel>> Consultar(CaTipoAnexoModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(CaTipoAnexoModel model)
        {
            return datos.Operacion(model);
        }
    }
}