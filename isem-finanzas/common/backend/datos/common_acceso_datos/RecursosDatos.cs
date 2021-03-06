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
    public class RecursosDatos : CRUD<RecursoModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();
        
        private static string StoreProcedure = "asp_crud_recursos";


        [Obsolete]
        public ResponseGeneric<List<RecursoModel>> Consultar(RecursoModel model)
        {
            try
            {
                #region Parametros

                List<RecursoModel> respuesta = new List<RecursoModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<RecursoModel>()
                                .FromSql<RecursoModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<RecursoModel>()
                                .FromSql<RecursoModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<RecursoModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<RecursoModel>>(e);
            }
        }

        public Response Operacion(RecursoModel model)
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

        private List<EntidadParametro> ObtenerParametros( RecursoModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();

            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_remitente", Tipo = "int", Valor = model.id_recurso == null ? "NULL" : model.id_recurso.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "string", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "descripcion", Tipo = "string", Valor = model.descripcion == null ? "NULL" : model.descripcion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });

            return parametros;
        }
    }
}
