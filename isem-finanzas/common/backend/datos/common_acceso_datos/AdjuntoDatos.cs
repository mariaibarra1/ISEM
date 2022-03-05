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

namespace AccesoDatos
{
    public class AdjuntoDatos : CRUD<AdjuntoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();
        
        private static string StoreProcedure = "asp_crud_adjuntos";

        [Obsolete]
        public ResponseGeneric<List<AdjuntoModel>> Consultar(AdjuntoModel model)
        {
            try
            {
                #region Parametros

                List<AdjuntoModel> respuesta = new List<AdjuntoModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<AdjuntoModel>()
                                .FromSql<AdjuntoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<AdjuntoModel>()
                                .FromSql<AdjuntoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<AdjuntoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<AdjuntoModel>>(e);
            }
        }

        [Obsolete]
        public Response Operacion(AdjuntoModel model)
        {
            try
            {
                #region Parametros

                int respuesta = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                
                List<AdjuntoModel> resultado = new List<AdjuntoModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL =
                                GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            resultado = conexion.Query<AdjuntoModel>()
                                .FromSql<AdjuntoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;
                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Database.ExecuteSqlCommand(resulMySQL.Query, resulMySQL.ListaParametros.ToArray());
                            //resultado = conexion.Query<AdjuntoModel>()
                            //    .FromSql<AdjuntoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                            //    .ToListAsync().Result;
                            break;
                    }
                }
                #endregion

                if (respuesta == 1)
                {
                    response.Status = ResponseStatus.Success;
                    response.respuesta = "1";
                    return response;
                }
                else
                {
                    return response;
                }
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<AdjuntoModel>>(e);
            }
        }
        
        private List<EntidadParametro> ObtenerParametros(AdjuntoModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();
            
            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_adjunto", Tipo = "String", Valor = model.id_adjunto == null ? "NULL" : model.id_adjunto.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "String", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "tamanio", Tipo = "String", Valor = model.tamanio == null ? "NULL" : model.tamanio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "tipo_adjunto", Tipo = "String", Valor = model.id_tipo_adjunto == null ? "NULL" : model.id_tipo_adjunto.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_oficio", Tipo = "String", Valor = model.id_oficio == null ? "NULL" : model.id_oficio.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_requerimiento_auditoria", Tipo = "String", Valor = model.id_requerimiento_auditoria == null ? "NULL" : model.id_requerimiento_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_suficiencia", Tipo = "String", Valor = model.id_suficiencia == null ? "NULL" : model.id_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });

            return parametros;
        }
    }
}

