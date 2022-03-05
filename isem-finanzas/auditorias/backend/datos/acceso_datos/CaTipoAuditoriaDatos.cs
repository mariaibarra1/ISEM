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
   public class CaTipoAuditoriaDatos : CRUD<CaTipoAuditoriaModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();

        private static string StoreProcedure = "asp_crud_tipos_auditoria";

        [Obsolete]
        public ResponseGeneric<List<CaTipoAuditoriaModel>> Consultar(CaTipoAuditoriaModel model)
        {
            try
            {
                #region Parametros

                List<EntidadParametro> parametros = this.ObtenerParametros(model);
                List<CaTipoAuditoriaModel> respuesta = new List<CaTipoAuditoriaModel>();

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaTipoAuditoriaModel>()
                                .FromSql<CaTipoAuditoriaModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<CaTipoAuditoriaModel>()
                                .FromSql<CaTipoAuditoriaModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }
                #endregion

                return new ResponseGeneric<List<CaTipoAuditoriaModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<CaTipoAuditoriaModel>>(e);
            }
        }

        public Response Operacion(CaTipoAuditoriaModel entidad)
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

        private List<EntidadParametro> ObtenerParametros(CaTipoAuditoriaModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_tipo_auditoria", Tipo = "String", Valor = model.id_tipo_auditoria == null ? "NULL" : model.id_tipo_auditoria.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "String", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "String", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });

            return parametros;
        }
    }
}
