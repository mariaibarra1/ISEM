using System;
using System.Collections.Generic;
using common_acceso_datos;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;
using Newtonsoft.Json;

namespace common_negocio
{
    public class AutenticacionNegocio
    {
        private UsuarioDatos _Datos = new UsuarioDatos();
        public Response IniciarSesion(Login modelo)
        {
            try
            {
                var filtro_usuario = new UsuarioModel();
                filtro_usuario.correo_electronico = modelo.usuario;
                filtro_usuario.tipoOperacion = (int)TipoOperacion.consultar;

                ResponseGeneric<List<UsuarioModel>> respuesta = _Datos.Consultar(filtro_usuario);
                UsuarioModel nuevo_usuario = respuesta.Response.Find(usuario => usuario.correo_electronico == modelo.usuario);

                if (nuevo_usuario == null)
                    return new Response(ResponseStatus.Failed, mensaje: "Usuario no registrado.", respuesta: null);
                if (nuevo_usuario.activo == false)
                    return new Response(ResponseStatus.Failed, mensaje: "Usuario inactivo.", respuesta: null);
                if (nuevo_usuario.contrasenia == null)
                    return new Response(ResponseStatus.Failed, "Contraseña no establecida.", respuesta: null);


                ComprobarPass comprobacion = new ComprobarPass(modelo.contrasenia, nuevo_usuario.contrasenia);
                Boolean resultado_comprobacion = verificarPass(comprobacion);

                if (resultado_comprobacion == false) 
                {
                    return new Response(ResponseStatus.Failed, mensaje: "Usuario existente, contraseña incorrecta.", respuesta: null);
                }
                return new Response(ResponseStatus.Success, mensaje: "usuario autenticado.", respuesta: JsonConvert.SerializeObject(nuevo_usuario));
            }
            catch (Exception ex)
            {
                return new Response(ResponseStatus.Failed, mensaje: ex.Message, respuesta: null);
            }
        }
        public bool verificarPass(ComprobarPass comprobacion)
        {
            if (comprobacion.texto_plano == null || comprobacion.password == null)
                return false;
            //string New_Pass = EncodeBase64(comprobacion.texto_plano);

            if (comprobacion.texto_plano == comprobacion.password)
                return true;
            else
                return false;
        }

    }
}
