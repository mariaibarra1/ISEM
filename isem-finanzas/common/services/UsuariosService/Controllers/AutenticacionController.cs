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
    public class AutenticacionController : Controller
    {
        private AutenticacionNegocio _Negocio = new AutenticacionNegocio();

        [HttpPost("[action]")]
        public IActionResult IniciarSesion([FromBody] Login model)
        {

            model.tipoOperacion = (int)TipoOperacion.consultar;
            model.contrasenia = Security.EncodeBase64(model.contrasenia);

            return this.ProcesarConsulta(model);
        }

        private IActionResult ProcesarConsulta(Login model)
        {
            try
            {
                var response = _Negocio.IniciarSesion(model);

                if (response.Status == Models.Response.ResponseStatus.Success)
                {
                    if (response.respuesta.Length > 0)
                    {
                        return Ok(response);
                    }
                    else
                    {
                        return NoContent();
                    }
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}