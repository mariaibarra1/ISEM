using System;
using System.Collections.Generic;
using auditorias_negocio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace CatalogosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class TiposRecepcionController : Controller
    {
        private CaTipoRecepcionNegocio negocio = new CaTipoRecepcionNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] CaTipoRecepcionModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] CaTipoRecepcionModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.agregar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] CaTipoRecepcionModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpDelete("[action]")]
        public IActionResult Eliminar([FromBody] CaTipoRecepcionModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }

        private IActionResult ProcesarConsulta(CaTipoRecepcionModel model)
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

        private IActionResult ProcesarTrasaccion(CaTipoRecepcionModel model)
        {
            try
            {
                var response = negocio.Operacion(model);

                if (response.Status == Models.Response.ResponseStatus.Success)
                {
                    return Ok();
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