using Connection;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using System;
using System.Collections.Generic;
using System.IO;

namespace suficiencias_acceso_datos
{
    public class SuficienciaDatos : CRUD<SuficienciaModel>
    {

        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedureCreate  = "asp_create_suficiencias";
        private static string StoreProcedureUpdate  = "asp_update_suficiencias";
        private static string StoreProcedureRead    = "asp_read_suficiencias";

        [Obsolete]
        public ResponseGeneric<List<SuficienciaModel>> Consultar(SuficienciaModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<SuficienciaModel> respuesta = new List<SuficienciaModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedureRead);
                            respuesta = conexion.Query<SuficienciaModel>()
                                .FromSql<SuficienciaModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedureRead);
                            respuesta = conexion.Query<SuficienciaModel>()
                                .FromSql<SuficienciaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<SuficienciaModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<SuficienciaModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(SuficienciaModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);

                List<SuficienciaModel> respuesta = new List<SuficienciaModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                string storeTransaccion = (model.tipoOperacion == 3) ? StoreProcedureUpdate : StoreProcedureCreate;

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, storeTransaccion);
                            SqlParameter[] arrSqlParametros = resultSQL.ListaParametros.ToArray();
                            result = conexion.Database.ExecuteSqlCommand(resultSQL.Query, arrSqlParametros);

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, storeTransaccion);
                            respuesta = conexion.Query<SuficienciaModel>()
                               .FromSql<SuficienciaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;
                            break;
                    }
                }

                #endregion
                if (respuesta != null || respuesta.Count >= 0)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = respuesta[0].id_suficiencia.ToString();

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
        
        private List<EntidadParametro> ObtenerParametros(SuficienciaModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_suficiencia", Tipo = "Int", Valor = model.id_suficiencia == null ? "NULL" : model.id_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_area", Tipo = "Int", Valor = model.id_area == null ? "NULL" : model.id_area.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fecha_recepcion", Tipo = "String", Valor = model.fecha_recepcion == null ? "NULL" : model.fecha_recepcion });
            parametros.Add(new EntidadParametro { Nombre = "sp", Tipo = "String", Valor = model.sp == null ? "NULL" : model.sp });
            parametros.Add(new EntidadParametro { Nombre = "asunto", Tipo = "String", Valor = model.asunto == null ? "NULL" : model.asunto });
            parametros.Add(new EntidadParametro { Nombre = "monto_solicitado", Tipo = "Decimal", Valor = model.monto_solicitado == null ? "NULL" : model.monto_solicitado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "monto_suficiencia", Tipo = "Decimal", Valor = model.monto_suficiencia == null ? "NULL" : model.monto_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "monto_adjudicado", Tipo = "Decimal", Valor = model.monto_adjudicado == null ? "NULL" : model.monto_adjudicado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "num_contrato", Tipo = "String", Valor = model.num_contrato == null ? "NULL" : model.num_contrato });
            parametros.Add(new EntidadParametro { Nombre = "folio", Tipo = "String", Valor = model.folio == null ? "NULL" : model.folio });
            parametros.Add(new EntidadParametro { Nombre = "fecha_liberacion", Tipo = "String", Valor = model.fecha_liberacion == null ? "NULL" : model.fecha_liberacion });
            parametros.Add(new EntidadParametro { Nombre = "fecha_limite", Tipo = "String", Valor = model.fecha_limite == null ? "NULL" : model.fecha_limite });
            parametros.Add(new EntidadParametro { Nombre = "fecha_turno", Tipo = "String", Valor = model.fecha_turno == null ? "NULL" : model.fecha_turno });
            parametros.Add(new EntidadParametro { Nombre = "id_estatus", Tipo = "Int", Valor = model.id_estatus == null ? "NULL" : model.id_estatus.ToString()});
            parametros.Add(new EntidadParametro { Nombre = "observacion", Tipo = "JSON", Valor = model.observacion == null ? "NULL" : model.observacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "fuentes_financiamiento", Tipo = "JSON", Valor = model.fuentes_financiamiento == null ? "NULL" : model.fuentes_financiamiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario", Tipo = "Int", Valor = model.id_usuario == null ? "NULL" : model.id_usuario.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_tipo_suficiencia", Tipo = "Int", Valor = model.id_tipo_suficiencia == null ? "NULL" : model.id_tipo_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "num_cheque", Tipo = "Int", Valor = model.num_cheque == null ? "NULL" : model.num_cheque.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "monto_cheque", Tipo = "Decimal", Valor = model.monto_cheque == null ? "NULL" : model.monto_cheque.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "banco_expedicion", Tipo = "String", Valor = model.banco_expedicion == null ? "NULL" : model.banco_expedicion });
            
            return parametros;
        }
    }
}
