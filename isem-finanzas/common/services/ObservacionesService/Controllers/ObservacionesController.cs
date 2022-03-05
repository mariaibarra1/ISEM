using System;
using observaciones_negocio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;

namespace CatalogosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class ObservacionesController : Controller
    {
        private ObservacionesNegocio negocio = new ObservacionesNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] ObservacionModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] ObservacionModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.agregar;
            return this.ProcesarTrasaccion(model);
        }

        private IActionResult ProcesarConsulta(ObservacionModel model)
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
        private IActionResult ProcesarTrasaccion(ObservacionModel model)
        {
            try
            {
                var response = negocio.Operacion(model);

                if (response.Status == Models.Response.ResponseStatus.Success)
                {
                    return Ok(response);
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
    }
}