using System;
using auditorias_negocio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;

namespace AuditoriasService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class AuditoriasController : Controller
    {
        private AuditoriaNegocio negocio = new AuditoriaNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] AuditoriaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] AuditoriaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.agregar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] AuditoriaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpDelete("[action]")]
        public IActionResult Eliminar([FromBody] AuditoriaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }

        private IActionResult ProcesarConsulta(AuditoriaModel model)
        {
            try
            {
                var response = negocio.Consultar(model);

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

        private IActionResult ProcesarTrasaccion(AuditoriaModel model)
        {
            try
            {
                var response = negocio.Operacion(model);

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