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
    public class RequerimientoAsignadoDatos : CRUD<RequerimientoAsignadoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_requerimientos_asignados";

        [Obsolete]
        public ResponseGeneric<List<RequerimientoAsignadoModel>> Consultar(RequerimientoAsignadoModel model)
        {
            try
            {
                #region Parametros

                List<RequerimientoAsignadoModel> respuesta = new List<RequerimientoAsignadoModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<RequerimientoAsignadoModel>()
                                .FromSql<RequerimientoAsignadoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<RequerimientoAsignadoModel>()
                                .FromSql<RequerimientoAsignadoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<RequerimientoAsignadoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<RequerimientoAsignadoModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(RequerimientoAsignadoModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                List<RequerimientoAsignadoModel> respuesta = new List<RequerimientoAsignadoModel>();
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
                            respuesta = conexion.Query<RequerimientoAsignadoModel>()
                               .FromSql<RequerimientoAsignadoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion
                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_requerimiento_asignado.ToString();

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

        private List<EntidadParametro> ObtenerParametros(RequerimientoAsignadoModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_requerimiento_asignado", Tipo = "int", Valor = model.id_requerimiento_asignado == null ? "NULL" : model.id_requerimiento_asignado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_requerimiento", Tipo = "int", Valor = model.id_requerimiento == null ? "NULL" : model.id_requerimiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_asignado", Tipo = "int", Valor = model.id_asignado == null ? "NULL" : model.id_asignado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_asignacion", Tipo = "String", Valor = model.fecha_asignacion == null ? "NULL" : model.fecha_asignacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_cancelacion", Tipo = "String", Valor = model.fecha_cancelacion == null ? "NULL" : model.fecha_cancelacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "aceptado", Tipo = "int", Valor = model.aceptado == true ? "1" : "0" });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });
            parametros.Add(new EntidadParametro { Nombre = "accion", Tipo = "int", Valor = model.accion == null ? "NULL" : model.accion.ToString() });
            return parametros;
        }
    }
}
