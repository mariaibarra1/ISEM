using System;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;
using suficiencias_negocio;

namespace SuficienciasService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class SuficienciasController: Controller
    {
        private SuficienciaNegocio negocio = new SuficienciaNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] SuficienciaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }
        [HttpPost("[action]")]
        public IActionResult ConsultarxFiltro([FromBody] SuficienciaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] SuficienciaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.agregar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] SuficienciaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpDelete("[action]")]
        public IActionResult Eliminar([FromBody] SuficienciaModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }

        private IActionResult ProcesarConsulta(SuficienciaModel model)
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
        private IActionResult ProcesarTrasaccion(SuficienciaModel model)
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
