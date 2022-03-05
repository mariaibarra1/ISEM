using Connection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace common_acceso_datos
{
    public class CaTipoSuficienciaDatos : CRUD<CaTipoSuficienciaModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_tipos_suficiencias";

        [Obsolete]
        public ResponseGeneric<List<CaTipoSuficienciaModel>> Consultar(CaTipoSuficienciaModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<CaTipoSuficienciaModel> respuesta = new List<CaTipoSuficienciaModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaTipoSuficienciaModel>()
                                .FromSql<CaTipoSuficienciaModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaTipoSuficienciaModel>()
                                .FromSql<CaTipoSuficienciaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<CaTipoSuficienciaModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaTipoSuficienciaModel>>(e);
            }
        }

        public Response Operacion(CaTipoSuficienciaModel entidad)
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

        private List<EntidadParametro> ObtenerParametros(CaTipoSuficienciaModel model)
        {

            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_tipo_suficiencia", Tipo = "String", Valor = model.id_tipo_suficiencia == null ? "NULL" : model.id_tipo_suficiencia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "String", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "String", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });

            return parametros;
        }


    }
}
