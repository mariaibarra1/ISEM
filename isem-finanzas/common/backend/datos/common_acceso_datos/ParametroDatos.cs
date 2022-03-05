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
    public class ParametroDatos : CRUD<ParametroModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

       public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
           .AddJsonFile("appsettings.json", optional: false).Build();

       private static string StoreProcedure = "asp_crud_parametros";

       [Obsolete]
       public ResponseGeneric<List<ParametroModel>> Consultar(ParametroModel model)
       {
           try
           {
               #region Parametros

               List<EntidadParametro> parametros = this.ObtenerParametros(model);
               List<ParametroModel> respuesta = new List<ParametroModel>();

               #endregion

               #region ConexionBD

               using (Contexto conexion = new Contexto())
               {
                   switch (int.Parse(Configuration["TipoBase"].ToString()))
                   {
                       case 1:
                           var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                           respuesta = conexion.Query<ParametroModel>()
                               .FromSql<ParametroModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                               .ToListAsync().Result;

                           break;

                       case 2:
                           var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                           respuesta = conexion.Query<ParametroModel>()
                               .FromSql<ParametroModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;

                           break;
                   }
               }
               #endregion

               return new ResponseGeneric<List<ParametroModel>>(respuesta);
           }
           catch (Exception e)
           {
               return new ResponseGeneric<List<ParametroModel>>(e);
           }
       }

       public Response Operacion(ParametroModel entidad)
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

       private List<EntidadParametro> ObtenerParametros(ParametroModel model)
       {

           List<EntidadParametro> parametros = new List<EntidadParametro>();

           parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = model.tipoOperacion.ToString() });
           parametros.Add(new EntidadParametro { Nombre = "id_parametro", Tipo = "int", Valor = model.id_parametro == null ? "NULL" : model.id_parametro.ToString() });
           parametros.Add(new EntidadParametro { Nombre = "monto", Tipo = "Decimal", Valor = model.monto == null ? "NULL" : model.monto.ToString() });
           parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "Int", Valor = model.activo == null ? "NULL" : model.activo == false ? "0" : "1" });

           return parametros;
       }


    }
}
