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
    public class CaRubroDatos : CRUD<CaRubroModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();
        
        private static string SP_CRUD = "asp_crud_rubros";

       [Obsolete]
        public ResponseGeneric<List<CaRubroModel>> Consultar(CaRubroModel model)
        {
            try
            {
                #region Parametros

                List<CaRubroModel> respuesta = new List<CaRubroModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, SP_CRUD);
                            respuesta = conexion.Query<CaRubroModel>()
                                .FromSql<CaRubroModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;
                             
                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, SP_CRUD);
                            respuesta = conexion.Query<CaRubroModel>()
                                .FromSql<CaRubroModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<CaRubroModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaRubroModel>>(e);
            }
        }

        public Response Operacion(CaRubroModel model)
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

        private List<EntidadParametro> ObtenerParametros(CaRubroModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_rubro", Tipo = "int", Valor = model.id_rubro == null ? "NULL" : model.id_rubro.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "string", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "string", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });

            return parametros;
        }

    }
}
