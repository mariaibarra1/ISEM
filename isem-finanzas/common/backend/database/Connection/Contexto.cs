using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Models.Modelos;
using Models.Response;
using System.IO;

namespace Connection
{
    public class Contexto : DbContext
    {
        [System.Obsolete]
        public virtual DbQuery<AuditoriaModel> AuditoriaModel { get; set; }
        public virtual DbQuery<Response> Response { get; set; }
        public virtual DbQuery<RemitenteModel> RemitenteModel { get; set; }
        public virtual DbQuery<CaTipoAnexoModel> CaTipoAnexoModel { get; set; }
        public virtual DbQuery<UsuarioModel> UsuarioModel { get; set; }
        public DbQuery<CaEnteFiscalModel> ca_entes_fiscales { get; set; }
        public DbQuery<CaTipoRecepcionModel> ca_tipos_recepcion { get; set; }
        public DbQuery<AdjuntoModel> tbl_adjuntos { get; set; }
        public DbQuery<CaTipoAuditoriaModel> ca_tipos_auditoria { get; set; }
        public DbQuery<CaTipoSuficienciaModel> ca_tipos_suficiencias { get; set; }
        public DbQuery<ParametroModel> parametroModel { get; set; }
        public DbQuery<SuficienciaModel> suficienciaModel { get; set; }
        public DbQuery<RecursoModel> recursoModel { get; set; }
        public DbQuery<CaTipoOficioModel> ca_tipo_oficio { get; set; }
        public DbQuery<FirmanteModel> tbl_firmante { get; set; }

        public virtual DbQuery<RequerimientoModel> RequerimientoModel { get; set; }
        public virtual DbQuery<CaRubroModel> CaRubroModel { get; set; }
        public virtual DbQuery<CaAreaModel> CaAreaModel { get; set; }
        public virtual DbQuery<CaFuenteFinanciamientoModel> CaFuenteFinanciamientoModel { get; set; }
        public virtual DbQuery<CaPartidaModel> CaPartidaModel { get; set; }
        public virtual DbQuery<ObservacionModel> ObservacionModel { get; set; }
        public virtual DbQuery<CaRolModel> CaRolModel { get; set; }
        public virtual DbQuery<OficioModel> OficioModel { get; set; }
        public virtual DbQuery<RequerimientoAsignadoModel> RequerimientoAsignadoModel { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionBuilder)
        {
            IConfiguration Configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: false).Build();
            int TipoBase = int.Parse(Configuration["TipoBase"].ToString());
            switch (TipoBase)
            {
                //Conexion SQL Server
                case 1:
                    optionBuilder.UseSqlServer(Configuration.GetConnectionString("ConnectionDBSQLServer"));
                    break;
                //Conexion MySql
                case 2:
                    optionBuilder.UseMySql(Configuration.GetConnectionString("ConnectionDBMySQL"));
                    break;
                case 3:
                    optionBuilder.UseNpgsql(Configuration.GetConnectionString("ConnectionDBPostGreSQL"));
                    break;
            }
        }
    }
}
