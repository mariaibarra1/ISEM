using Connection;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using System;
using System.Collections.Generic;
using System.IO;


namespace observaciones_acceso_datos
{
    public class ObservacionesDatos : CRUD<ObservacionModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_observaciones";

        [Obsolete]
        public ResponseGeneric<List<ObservacionModel>> Consultar(ObservacionModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<ObservacionModel> respuesta = new List<ObservacionModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<ObservacionModel>()
                                .FromSql<ObservacionModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<ObservacionModel>()
                                .FromSql<ObservacionModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<ObservacionModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<ObservacionModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(ObservacionModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                List<ObservacionModel> respuesta = new List<ObservacionModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            SqlParameter[] arrSqlParametros = resultSQL.ListaParametros.ToArray();
                            result = conexion.Database.ExecuteSqlCommand(resultSQL.Query, arrSqlParametros);

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<ObservacionModel>()
                               .FromSql<ObservacionModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion

                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_observacion.ToString();

                    return response;
                }
                else
                {
                    return response;
                }
            }
            catch (Exception e)
            {
                return new Response(ResponseStatus.Failed, mensaje: e.Message, respuesta: e.InnerException?.Message);
            }
        }

        private List<EntidadParametro> ObtenerParametros(ObservacionModel model)
        {

            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_observacion", Tipo = "String", Valor = model.id_observacion == null ? "NULL" : model.id_observacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_auditoria", Tipo = "String", Valor = model.id_auditoria == null ? "NULL" : model.id_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_suficiencia", Tipo = "String", Valor = model.id_suficiencia == null ? "NULL" : model.id_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "observacion", Tipo = "String", Valor = model.observacion == null ? "NULL" : model.observacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_creacion", Tipo = "String", Valor = model.fecha_creacion == null ? "NULL" : model.fecha_creacion.ToString() });

            return parametros;
        }
    }
}
