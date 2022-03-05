using common_negocio;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Interfaz;
using Models.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogosService.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class ParametroController : Controller
    {
        
       private ParametroNegocio negocio = new ParametroNegocio();

       [HttpGet("[action]")]
       public IActionResult Consultar([FromQuery] ParametroModel model)
       {
           model.tipoOperacion = (int) TipoOperacion.consultar;
           return this.ProcesarConsulta(model);
       }

       private IActionResult ProcesarConsulta(ParametroModel model)
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
