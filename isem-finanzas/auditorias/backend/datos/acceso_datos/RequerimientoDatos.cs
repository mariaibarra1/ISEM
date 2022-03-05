using System;
using System.Collections.Generic;
using System.IO;
using Connection;
using System.Data.SqlClient;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace auditorias_acceso_datos
{
    public class RequerimientoDatos : CRUD<RequerimientoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_requerimientos";

        [Obsolete]
        public ResponseGeneric<List<RequerimientoModel>> Consultar(RequerimientoModel model)
        {
            try
            {
                #region Parametros

                List<RequerimientoModel> respuesta = new List<RequerimientoModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<RequerimientoModel>()
                                .FromSql<RequerimientoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<RequerimientoModel>()
                                .FromSql<RequerimientoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<RequerimientoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<RequerimientoModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(RequerimientoModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                List<RequerimientoModel> respuesta = new List<RequerimientoModel>();
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
                            respuesta = conexion.Query<RequerimientoModel>()
                               .FromSql<RequerimientoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion
                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_requerimiento.ToString();

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

        private List<EntidadParametro> ObtenerParametros(RequerimientoModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_requerimiento", Tipo = "int", Valor = model.id_requerimiento == null ? "NULL" : model.id_requerimiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_oficio", Tipo = "int", Valor = model.id_oficio == null ? "NULL" : model.id_oficio.ToString() });
            //parametros.Add(new EntidadParametro { Nombre = "id_asignado", Tipo = "int", Valor = model.id_asignado == null ? "NULL" : model.id_asignado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "String", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_recepcion", Tipo = "String", Valor = model.fecha_recepcion == null ? "NULL" : model.fecha_recepcion.ToString() });
            //parametros.Add(new EntidadParametro { Nombre = "fecha_asignacion", Tipo = "String", Valor = model.fecha_asignacion == null ? "NULL" : model.fecha_asignacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario_requerimiento", Tipo = "int", Valor = model.id_usuario_requerimiento == null ? "NULL" : model.id_usuario_requerimiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_estatus", Tipo = "int", Valor = model.id_estatus == null ? "NULL" : model.id_estatus.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "observaciones", Tipo = "JSON", Valor = (model.observaciones == null || model.observaciones == "") ? "NULL" : model.observaciones.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "lista_asignados", Tipo = "JSON", Valor = (model.lista_asignados == null || model.lista_asignados == "") ? "NULL" : model.lista_asignados.ToString() });
            return parametros;
        }
    }
}
