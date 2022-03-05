using System;
using System.Collections.Generic;
using System.IO;
using Connection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_acceso_datos
{
    public class CaTipoAnexoDatos : CRUD<CaTipoAnexoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();
        
        private static string SP_CRUD = "asp_crud_tipos_adjunto";

        [Obsolete]
        public ResponseGeneric<List<CaTipoAnexoModel>> Consultar(CaTipoAnexoModel model)
        {
            try
            {
                #region Parametros

                List<CaTipoAnexoModel> respuesta = new List<CaTipoAnexoModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, SP_CRUD);
                            respuesta = conexion.Query<CaTipoAnexoModel>()
                                .FromSql<CaTipoAnexoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, SP_CRUD);
                            respuesta = conexion.Query<CaTipoAnexoModel>()
                                .FromSql<CaTipoAnexoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<CaTipoAnexoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaTipoAnexoModel>>(e);
            }
        }

        public Response Operacion(CaTipoAnexoModel model)
        {
            try
            {
                return new Response(ResponseStatus.Success, null, null);
            }
            catch (Exception e)
            {
                return new Response(ResponseStatus.Failed, mensaje: e.Message, respuesta: e.InnerException?.Message);
            }
        }

        private List<EntidadParametro> ObtenerParametros(CaTipoAnexoModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_tipo_adjunto", Tipo = "int", Valor = model.id_tipo_adjunto == null ? "NULL" : model.id_tipo_adjunto.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "string", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "string", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });

            return parametros;
        }

    }
}
