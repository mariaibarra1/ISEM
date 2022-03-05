using System;
using System.Collections.Generic;
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
    public class RequerimientosController : Controller
    {
        private RequerimientoNegocio negocio = new RequerimientoNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] RequerimientoModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] RequerimientoModel model)
        {

            //List<string> resultList = new List<string>();
            //model.ForEach(requerimiento =>
            //{

            //    requerimiento.tipoOperacion = (int)TipoOperacion.agregar;
            //    ObjectResult respuesta = this.ProcesarTrasaccion(requerimiento) as ObjectResult;
            //    resultList.Add(respuesta is null ? "null": (respuesta.Value is null ? "null" : respuesta.Value.ToString()));
            //});

            model.tipoOperacion = (int)TipoOperacion.agregar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] RequerimientoModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [HttpDelete("[action]")]
        public IActionResult Eliminar([FromQuery] RequerimientoModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }

        private IActionResult ProcesarConsulta(RequerimientoModel model)
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

        private IActionResult ProcesarTrasaccion(RequerimientoModel model)
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