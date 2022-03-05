using System;
using System.Collections.Generic;
using System.IO;
using Connection;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace suficiencias_acceso_datos
{
    public class FirmanteDatos : CRUD<FirmanteModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_firmantes";

        [Obsolete]
        public ResponseGeneric<List<FirmanteModel>> Consultar(FirmanteModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<FirmanteModel> respuesta = new List<FirmanteModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<FirmanteModel>()
                                .FromSql<FirmanteModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;
                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<FirmanteModel>()
                                .FromSql<FirmanteModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;
                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<FirmanteModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<FirmanteModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(FirmanteModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
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
                            result = conexion.Database.ExecuteSqlCommand(resulMySQL.Query, resulMySQL.ListaParametros.ToArray());
                            break;
                    }
                }

                #endregion

                if (result == 1)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = "1";
                    return response;
                }
                else
                {
                    response.mensaje = "No se pudo realizar la operación";
                    return response;
                }
            }
            catch (Exception e)
            {
                return new Response(ResponseStatus.Failed, mensaje: e.Message, respuesta: e.InnerException?.Message);
            }
        }

        private List<EntidadParametro> ObtenerParametros(FirmanteModel model)
        {

            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_suficiencia", Tipo = "String", Valor = model.id_suficiencia == null ? "NULL" : model.id_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_elaboro", Tipo = "String", Valor = model.id_elaboro == null ? "NULL" : model.id_elaboro.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_reviso", Tipo = "String", Valor = model.id_reviso == null ? "NULL" : model.id_reviso.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_valido", Tipo = "String", Valor = model.id_valido == null ? "NULL" : model.id_valido.ToString() });

            return parametros;
        }
    }
}
