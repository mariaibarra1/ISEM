using System;
using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace common_negocio
{
    public class UsuarioNegocio : CRUD<UsuarioModel>
    {
        private UsuarioDatos datos = new UsuarioDatos();

        public ResponseGeneric<List<UsuarioModel>> Consultar(UsuarioModel model)
        {
            return datos.Consultar(model);
        }

        public Response Operacion(UsuarioModel model)
        {
            return datos.Operacion(model);
        }
    }
}