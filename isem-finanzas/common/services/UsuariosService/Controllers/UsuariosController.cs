using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using common_negocio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;
using UsuariosService.utils;

namespace UsuariosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class UsuariosController : Controller
    {


        private UsuarioNegocio _Negocio = new UsuarioNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] UsuarioModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] UsuarioModel model)
        {

            model.tipoOperacion = (int)TipoOperacion.agregar;
            //Se genera contrasenia aleatoria
            model.contrasenia = Security.RandomPassword();

            return this.ProcesarTrasaccion(model);
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] UsuarioModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpDelete("[action]")]
        public IActionResult Eliminar([FromQuery] UsuarioModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }


        private IActionResult ProcesarConsulta(UsuarioModel model)
        {
            try
            {
                var response = _Negocio.Consultar(model);

                if (response.Status == Models.Response.ResponseStatus.Success)
                {
                    if (response.Response.Count > 0)
                    {
                        return Ok(response.Response);
                    }
                    else
                    {
                        return NoContent();
                    }
                }
                else
                {
                    return BadRequest(response.CurrentException);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        private IActionResult ProcesarTrasaccion(UsuarioModel model)
        {
            try
            {
                var response = _Negocio.Operacion(model);

                if (response.Status == Models.Response.ResponseStatus.Success)
                {
                    return Ok(response.respuesta);
                }
                else
                {
                    return BadRequest(response.mensaje);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}