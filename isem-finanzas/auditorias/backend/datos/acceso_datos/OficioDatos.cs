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
    public class OficioDatos : CRUD<OficioModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_oficios";

        [Obsolete]
        public ResponseGeneric<List<OficioModel>> Consultar(OficioModel model)
        {
            try
            {
                #region Parametros

                List<OficioModel> respuesta = new List<OficioModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<OficioModel>()
                                .FromSql<OficioModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<OficioModel>()
                                .FromSql<OficioModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<OficioModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<OficioModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(OficioModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                List<OficioModel> respuesta = new List<OficioModel>();

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
                            respuesta = conexion.Query<OficioModel>()
                               .FromSql<OficioModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion

                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_oficio.ToString();

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

        private List<EntidadParametro> ObtenerParametros(OficioModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_oficio", Tipo = "int", Valor = model.id_oficio == null ? "NULL" : model.id_oficio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_auditoria", Tipo = "int", Valor = model.id_auditoria == null ? "NULL" : model.id_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "num_oficio", Tipo = "String", Valor = model.num_oficio == null ? "NULL" : model.num_oficio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_recepcion", Tipo = "String", Valor = model.fecha_recepcion == null ? "NULL" : model.fecha_recepcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_cumplimiento", Tipo = "String", Valor = model.fecha_cumplimiento == null ? "NULL" : model.fecha_cumplimiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_area_remitente", Tipo = "int", Valor = model.id_area_remitente == null ? "NULL" : model.id_area_remitente.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_persona_remitente", Tipo = "int", Valor = model.id_persona_remitente == null ? "NULL" : model.id_persona_remitente.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "String", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario_oficio", Tipo = "int", Valor = model.id_usuario_oficio == null ? "NULL" : model.id_usuario_oficio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_estatus", Tipo = "int", Valor = model.id_estatus == null ? "NULL" : model.id_estatus.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "solicitar_prorroga", Tipo = "int", Valor = model.solicitar_prorroga == true ? "1" : "0" });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario_busqueda", Tipo = "int", Valor = model.id_usuario_busqueda == null ? "NULL" : model.id_usuario_busqueda.ToString() });
            return parametros;
        }
    }
}
