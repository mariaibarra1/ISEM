using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using common_negocio.Negocio;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models.Interfaz;
using Models.Modelos;
using Models.Response;

namespace AdjuntosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("CorsPolicy")]
    [Produces("application/json")]
    public class AdjuntosController : Controller
    {
        private static string basePath = Directory.GetCurrentDirectory();
        private static string credentialsPath = basePath + "/Credentials/pm-atencion-ciudadano-5e8d70dcff6d.json";
        private static string bucketName = "atncd-prd";

        private readonly IConfiguration _configuration;

        public AdjuntosController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private AdjuntoNegocio negocio = new AdjuntoNegocio();

        [HttpGet("[action]")]
        public IActionResult Consultar([FromQuery] AdjuntoModel model)
        {
            model.tipoOperacion = (int)TipoOperacion.consultar;
            return this.ProcesarConsulta(model);
        }

        [HttpPost("[action]")]
        public IActionResult Agregar([FromBody] Archivo archivo)
        {
            try
            {

                AdjuntoModel adjunto = new AdjuntoModel();

                adjunto.tipoOperacion = (int)TipoOperacion.agregar;
                adjunto.nombre = archivo.nombre;
                adjunto.tamanio = archivo.tamanio.ToString();
                adjunto.id_tipo_adjunto = archivo.id_tipo_adjunto;
                adjunto.id_oficio = archivo.id_oficio;
                adjunto.id_requerimiento_auditoria = archivo.id_requerimiento_auditoria;
                adjunto.id_suficiencia = archivo.id_suficiencia;
                adjunto.activo = true;

                StringBuilder archivoPath = new StringBuilder();

                archivoPath.Append(archivo.nombre.Substring(0, archivo.nombre.LastIndexOf(".",
                    StringComparison.Ordinal)) + "_" + DateTime.Now.ToString("yyyyMMddHHmmss"));
                archivoPath.Append(archivo.nombre.Substring(archivo.nombre.LastIndexOf(".", StringComparison.Ordinal)));

                Byte[] bytes = Convert.FromBase64String(archivo.base64
                    .Substring(archivo.base64.LastIndexOf(",", StringComparison.Ordinal) + 1));

                MemoryStream archivoStream = new MemoryStream();

                archivoStream.Write(bytes, 0, bytes.Length);

                var credential = GoogleCredential.FromFile(credentialsPath);

                StorageClient storageClient = StorageClient.Create(credential);

                Object storageResult = null;

                using (var f = archivoStream)
                {
                    storageResult = storageClient.UploadObject(bucketName, Path.GetFileName(archivoPath.ToString()),
                        archivo.tipo, f);
                }

                archivoStream.Flush();
                archivoStream.Close();

                return this.ProcesarTrasaccion(adjunto);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message.ToString());
            }
        }

        [DisableRequestSizeLimit]
        [HttpPost("[action]")]
        public ActionResult<List<string>> AgregarLista([FromBody] List<Archivo> archivos)
        {
            List<string> storageResultList = new List<string>();

            archivos.ForEach(archivo => {

                ObjectResult respuesta = this.Agregar(archivo) as ObjectResult;

                storageResultList.Add(respuesta is null ? "null" : (respuesta.Value is null ? "null" : respuesta.Value.ToString())); 
            });

            return storageResultList;
        }

        [HttpPut("[action]")]
        public IActionResult Modificar([FromBody] AdjuntoModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.modificar;
            return this.ProcesarTrasaccion(model);
        }

        [Route("[action]")]
        [HttpPost]
        public IActionResult Eliminar([FromBody] AdjuntoModel model)
        {
            model.tipoOperacion = (int) TipoOperacion.eliminar;
            return this.ProcesarTrasaccion(model);
        }


        [HttpPost("[action]")]
        public ActionResult<List<Archivo>> verAdjunto([FromBody] List<Archivo> lista)
        {
            try
            {
                var credential = GoogleCredential.FromFile(credentialsPath);

                StorageClient storageClient = StorageClient.Create(credential);

                List<Archivo> busqueda = (lista != null && lista.Count > 0) ? lista : new List<Archivo>() {
                        new Archivo() {nombre = ""}
                };

                List<Archivo> resultados = new List<Archivo>();

                foreach (var fnd in busqueda)
                {
                    foreach (var storageObject in storageClient.ListObjects(bucketName, fnd.nombre ?? ""))
                    {
                        MemoryStream stream = DownloadObjectStream(storageObject.Name);

                        resultados.Add(new Archivo()
                        {
                            nombre = storageObject.Name,
                            base64 = Base64String(stream),
                            tipo = storageObject.ContentType,
                            tamanio = storageObject.Size.ToString()
                        });

                        stream.Flush();
                        stream.Close();
                    }
                }

                return resultados;
            }
            catch (Exception e)
            {
                return new List<Archivo>();
            }

        }

        private IActionResult ProcesarConsulta(AdjuntoModel model)
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

        private IActionResult ProcesarTrasaccion(AdjuntoModel model)
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
                    return BadRequest(response.CurrentException);
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private MemoryStream DownloadObjectStream(string name)
        {
            try
            {
                var credential = GoogleCredential.FromFile(credentialsPath);

                StorageClient client = StorageClient.Create(credential);

                MemoryStream archivoStream = new MemoryStream();

                client.DownloadObject(bucketName, name, archivoStream);

                return archivoStream;
            }
            catch (Exception e)
            {
                return new MemoryStream();
            }
        }

        private String Base64String(MemoryStream stream)
        {
            try
            {
                return Convert.ToBase64String(stream.ToArray());
                ;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }

        public class Archivo
        {
            public int? id_anexo { get; set; }
            public string nombre { get; set; }
            public string tipo { get; set; }
            public string tamanio { get; set; }
            public int? id_tipo_adjunto { get; set; }
            public int? id_auditoria { get; set; }
            public int? id_oficio { get; set; }
            public int? id_requerimiento_auditoria { get; set; }
            public long? id_suficiencia { get; set; }
            public string base64 { get; set; }
            
        }
    }
}