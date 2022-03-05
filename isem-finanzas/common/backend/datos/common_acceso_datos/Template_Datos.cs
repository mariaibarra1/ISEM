using Connection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Response;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;

namespace common_acceso_datos
{
    public class Template_Datos<T> : CRUD<T>
    {
        public BDParametros GeneracionParametros = new BDParametros();
        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: false).Build();
        string StoreProcedure = "nombre_procedimiento";
        /// <summary>
        /// Consultar Informacion
        /// </summary>
        /// <param name="entidad"></param>
        /// <returns></returns>
        public ResponseGeneric<List<T>> Consultar(T entidad)
        {
            //try
            //{
            //    #region Parametros
            //    List<EntidadParametro> ListaEnvioParam = this.ObtenerParametros(entidad);

            //    List<TBL_USUARIO> Lista = new List<TBL_USUARIO>();

            //    #endregion

            //    #region ConexionBD
            //    using (Contexto conexion = new Contexto())
            //    {
            //        switch (int.Parse(Configuration["TipoBase"].ToString()))
            //        {
            //            case 1:
            //                var resultSQL = GeneracionParametros.ParametrosSqlServer(ListaEnvioParam, StoreProcedure);
            //                Lista = conexion.Query<TBL_USUARIO>().FromSql<TBL_USUARIO>(resultSQL.Query, resultSQL.ListaParametros.ToArray()).ToListAsync().Result;

            //                break;
            //            case 2:
            //                var resulMySQL = GeneracionParametros.ParametrosMySQL(ListaEnvioParam, StoreProcedure);
            //                Lista = conexion.Query<TBL_USUARIO>().FromSql<TBL_USUARIO>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray()).ToListAsync().Result;

            //                break;
            //        }

            //    }
            //    #endregion

            //    return new ResponseGeneric<List<TBL_USUARIO>>(Lista);

            //}
            //catch (Exception ex)
            //{

            //    return new ResponseGeneric<List<TBL_USUARIO>>(ex);
            //}
            throw new NotImplementedException();
        }
        /// <summary>
        /// Obtener parametros
        /// </summary>
        /// <param name="entidad"></param>
        /// <param name="operacion"></param>
        /// <returns></returns>
        public List<EntidadParametro> ObtenenerParamtetros(T entidad, TipoOperacion operacion)
        {

            List<EntidadParametro> lstParametros = new List<EntidadParametro>();
            lstParametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "Int", Valor = operacion.ToString() });
            lstParametros.Add(new EntidadParametro { Nombre = "parametro_1", Tipo = "Int", Valor = "NULL" });
            lstParametros.Add(new EntidadParametro { Nombre = "parametro_2", Tipo = "String", Valor = "NULL" });


            // OUTPUTS params
            lstParametros.Add(new EntidadParametro { Nombre = "mensaje", Tipo = "String", Valor = "", TieneOutput = true });
            lstParametros.Add(new EntidadParametro { Nombre = "respuesta", Tipo = "String", Valor = "", TieneOutput = true });

            return lstParametros;
        }
        /// <summary>
        /// Operacion base de datos Agregar, Modificar o Eliminar
        /// </summary>
        /// <param name="entidad"></param>
        /// <returns></returns>
        public Response Operacion(T entidad)
        {
            //try
            //{
            //    #region Parametros
            // List<EntidadParametro> ListaEnvioParam = this.ObtenerParametros(entidad,TipoOperacion.agregar);
            //   Response respuesta = new Response(ResponseStatus.Failed, "", "");

            //    int result = 0;
            //    #endregion

            //    #region ConexionBD
            //    using (Contexto conexion = new Contexto())
            //    {
            //        switch (int.Parse(Configuration["TipoBase"].ToString()))
            //        {
            //            case 1:
            //                var resultSQL = GeneracionParametros.ParametrosSqlServer(ListaEnvioParam, StoreProcedure);
            //                SqlParameter[] arrSqlParametros = resultSQL.ListaParametros.ToArray();
            //                result = conexion.Database.ExecuteSqlCommand(resultSQL.Query, arrSqlParametros);
            //                // Guardamos los parámetros de salida.
            //                respuesta.exito = new List<SqlParameter>(arrSqlParametros).Find(param => param.ParameterName == "exito").Value.ToString() == "1" ? true : false;
            //                respuesta.mensaje = new List<SqlParameter>(arrSqlParametros).Find(param => param.ParameterName == "mensaje").Value.ToString();
            //                respuesta.respuesta = new List<SqlParameter>(arrSqlParametros).Find(param => param.ParameterName == "respuesta").Value.ToString();
            //                break;
            //            case 2:
            //                var resulMySQL = GeneracionParametros.ParametrosMySQL(ListaEnvioParam, StoreProcedure);
            //                result = conexion.Database.ExecuteSqlCommand(resulMySQL.Query, resulMySQL.ListaParametros.ToArray());
            //                break;
            //        }

            //    }
            //    #endregion
            //    #region Resultado
            //    if (result == 1)
            //    {
            //        return respuesta;
            //    }
            //    else
            //    {
            //        return respuesta;
            //    }
            //    #endregion
            //}
            //catch (Exception ex)
            //{

            //return new Response(ResponseStatus.Failed,ex.ToString(),"Error Acceso Datos");
            //}
            throw new NotImplementedException();
        }
    }
}
