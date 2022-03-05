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
    public class AuditoriaDatos : CRUD<AuditoriaModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_auditorias";

        [Obsolete]
        public ResponseGeneric<List<AuditoriaModel>> Consultar(AuditoriaModel model)
        {
            try
            {
                #region Parametros

                List<AuditoriaModel> respuesta = new List<AuditoriaModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<AuditoriaModel>()
                                .FromSql<AuditoriaModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<AuditoriaModel>()
                                .FromSql<AuditoriaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<AuditoriaModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<AuditoriaModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(AuditoriaModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                List<AuditoriaModel> respuesta = new List<AuditoriaModel>();

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
                            //result = conexion.Database.ExecuteSqlCommand(resulMySQL.Query, resulMySQL.ListaParametros.ToArray());
                            respuesta = conexion.Query<AuditoriaModel>()
                               .FromSql<AuditoriaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion

                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_auditoria.ToString();

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

        private List<EntidadParametro> ObtenerParametros(AuditoriaModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_auditoria", Tipo = "int", Valor = model.id_auditoria == null ? "NULL" : model.id_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "ejercicio", Tipo = "int", Valor = model.ejercicio == null ? "NULL" : model.ejercicio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_recepcion", Tipo = "String", Valor = model.fecha_recepcion == null ? "NULL" : model.fecha_recepcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_cumplimiento", Tipo = "String", Valor = model.fecha_cumplimiento == null ? "NULL" : model.fecha_cumplimiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "inicio_revision", Tipo = "String", Valor = model.inicio_revision == null ? "NULL" : model.inicio_revision.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fin_revision", Tipo = "String", Valor = model.fin_revision == null ? "NULL" : model.fin_revision.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_fiscal", Tipo = "int", Valor = model.id_fiscal == null ? "NULL" : model.id_fiscal.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_area_remitente", Tipo = "int", Valor = model.id_area_remitente == null ? "NULL" : model.id_area_remitente.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_remitente", Tipo = "int", Valor = model.id_remitente == null ? "NULL" : model.id_remitente.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "folio", Tipo = "String", Valor = model.folio == null ? "NULL" : model.folio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == null ? "NULL" : model.activo.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_tipo_recepcion", Tipo = "int", Valor = model.id_tipo_recepcion == null ? "NULL" : model.id_tipo_recepcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_estatus", Tipo = "int", Valor = model.id_estatus == null ? "NULL" : model.id_estatus.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "String", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre_auditoria", Tipo = "String", Valor = model.nombre_auditoria == null ? "NULL" : model.nombre_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "num_auditoria", Tipo = "String", Valor = model.num_auditoria == null ? "NULL" : model.num_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario_busqueda", Tipo = "Int", Valor = model.id_usuario_busqueda == null ? "NULL" : model.id_usuario_busqueda.ToString() });

            return parametros;
        }
    }
}
