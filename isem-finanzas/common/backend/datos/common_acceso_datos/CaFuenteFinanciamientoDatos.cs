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
    public class CaFuenteFinanciamientoDatos : CRUD<CaFuenteFinanciamientoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_fuentes_financiamiento";

        [Obsolete]
        public ResponseGeneric<List<CaFuenteFinanciamientoModel>> Consultar(CaFuenteFinanciamientoModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<CaFuenteFinanciamientoModel> respuesta = new List<CaFuenteFinanciamientoModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaFuenteFinanciamientoModel>()
                                .FromSql<CaFuenteFinanciamientoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaFuenteFinanciamientoModel>()
                                .FromSql<CaFuenteFinanciamientoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<CaFuenteFinanciamientoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaFuenteFinanciamientoModel>>(e);
            }
        }
        public Response Operacion(CaFuenteFinanciamientoModel entidad)
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
        private List<EntidadParametro> ObtenerParametros(CaFuenteFinanciamientoModel model)
        {

            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_fuente_financiamiento", Tipo = "String", Valor = model.id_fuente_financiamiento == null ? "NULL" : model.id_fuente_financiamiento.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "clave", Tipo = "String", Valor = model.clave == null ? "NULL" : model.clave.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "String", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });

            return parametros;
        }
    }
}
