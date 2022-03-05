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

namespace common_acceso_datos
{
    public class UsuarioDatos : CRUD<UsuarioModel>
    {
        public BDParametros GeneracionParametros = new BDParametros();

        public IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false).Build();
        
        private static string StoreProcedure = "asp_crud_usuarios";

        [Obsolete]
        public ResponseGeneric<List<UsuarioModel>> Consultar(UsuarioModel model)
        {
            try
            {
                #region Parametros

                List<UsuarioModel> respuesta = new List<UsuarioModel>();

                List<EntidadParametro> parametros = this.ObtenerParametros(model);

                #endregion

                #region ConexionBD

                using (Contexto conexion = new Contexto())
                {
                    switch (int.Parse(Configuration["TipoBase"].ToString()))
                    {
                        case 1:
                            var resultSQL = GeneracionParametros.ParametrosSqlServer(parametros, StoreProcedure);
                            respuesta = conexion.Query<UsuarioModel>()
                                .FromSql<UsuarioModel>(resultSQL.Query, resultSQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;

                        case 2:
                            var resulMySQL = GeneracionParametros.ParametrosMySQL(parametros, StoreProcedure);
                            respuesta = conexion.Query<UsuarioModel>()
                                .FromSql<UsuarioModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                                .ToListAsync().Result;

                            break;
                    }
                }

                #endregion

                return new ResponseGeneric<List<UsuarioModel>>(respuesta);
            }
            catch (Exception e)
            {
                return new ResponseGeneric<List<UsuarioModel>>(e);
            }
        }
        
        [Obsolete]
        public Response Operacion(UsuarioModel model)
        {
            try
            {
                #region Parametros

                int result = 0;

                Response response = new Response(ResponseStatus.Failed, null, null);
                //List<UsuarioModel> respuesta = new List<UsuarioModel>();

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
                            /*respuesta = conexion.Query<UsuarioModel>()
                               .FromSql<UsuarioModel>(resulMySQL.Query, resulMySQL.ListaParametros.ToArray())
                               .ToListAsync().Result;*/
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

        private List<EntidadParametro> ObtenerParametros(UsuarioModel model)
        {
            List<EntidadParametro> parametros = new List<EntidadParametro>();


            parametros.Add(new EntidadParametro { Nombre = "tipo", Tipo = "int", Valor = model.tipoOperacion.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_usuario", Tipo = "int", Valor = model.id_usuario == null ? "NULL" : model.id_usuario.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "nombre", Tipo = "string", Valor = model.nombre == null ? "NULL" : model.nombre.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "apellido_paterno", Tipo = "string", Valor = model.apellido_paterno == null ? "NULL" : model.apellido_paterno.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "apellido_materno", Tipo = "string", Valor = model.apellido_materno == null ? "NULL" : model.apellido_materno.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "correo_electronico", Tipo = "string", Valor = model.correo_electronico == null ? "NULL" : model.correo_electronico.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "contrasenia", Tipo = "string", Valor = (model.contrasenia == null || model.contrasenia == "") ? "NULL" : model.contrasenia.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "id_rol", Tipo = "int", Valor = model.id_rol == null ? "NULL" : model.id_rol.ToString() });
            parametros.Add(new EntidadParametro { Nombre = "activo", Tipo = "int", Valor = model.activo == true ? "1" : "0" });

            return parametros;
        }

    }
}
