using System;
using auditorias_negocio;
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
    public class CaFuenteFinanciamientoController : Controller
    {
        private CaFuenteFinanciamientoNegocio negocio = new CaFuenteFinanciamientoNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] CaFuenteFinanciamientoModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        private IActionResult ProcesarConsulta(CaFuenteFinanciamientoModel model)
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

    }
}