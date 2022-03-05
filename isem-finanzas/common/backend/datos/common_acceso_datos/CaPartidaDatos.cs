using System;
using System.Collections.Generic;
using System.IO;
using Connection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace common_acceso_datos
{
    public class CaPartidaDatos : CRUD<CaPartidaModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_partidas";

        [Obsolete]
        public ResponseGeneric<List<CaPartidaModel>> Consultar(CaPartidaModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<CaPartidaModel> respuesta = new List<CaPartidaModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaPartidaModel>()
                                .FromSql<CaPartidaModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaPartidaModel>()
                                .FromSql<CaPartidaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<CaPartidaModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaPartidaModel>>(e);
            }
        }
        public Response Operacion(CaPartidaModel entidad)
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

        private List<EntidadParametro> ObtenerParametros(CaPartidaModel model)
        {

            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_partida", Tipo = "String", Valor = model.id_partida == null ? "NULL" : model.id_partida.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "partida", Tipo = "String", Valor = model.partida == null ? "NULL" : model.partida.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "concepto", Tipo = "String", Valor = model.concepto == null ? "NULL" : model.concepto.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });
            parametros.Add(new EntidadParametro { Nombre = "monto_max_real", Tipo = "Decimal", Valor = model.monto_max_real == null ? "NULL" : model.monto_max_real.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "monto_modificado", Tipo = "Decimal", Valor = model.monto_modificado == null ? "NULL" : model.monto_modificado.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_fuente_financiamiento", Tipo = "String", Valor = model.id_fuente_financiamiento == null ? "NULL" : model.id_fuente_financiamiento.ToString() });
            return parametros;
        }

    }
}
