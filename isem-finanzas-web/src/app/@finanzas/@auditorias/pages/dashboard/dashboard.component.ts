import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThemeConstants } from '../../../../@espire/shared/config/theme-constant';
import { AuditoriaService } from '../../services/auditoria.service';
import { AuditoriaModel } from '../../models/auditoria.model';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { UsuarioModel } from 'src/app/@finanzas/@auditorias/models/usuario.model';
import { ascending } from 'd3';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  public listAuditorias: Array<AuditoriaModel> = [];
  
  public usuario: UsuarioModel;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private themeConstants: ThemeConstants,
    private servicioAuditoria: AuditoriaService
  ) {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  async ngOnInit() {

    this.dtOptions = this.themeConstants.dtOptions;
    await this.consultarAuditorias();
  }

  async consultarAuditorias() {
    
    if (this.usuario.id_rol === 10) {
      // tslint:disable-next-line: max-line-length
      let listAuditorias_: Array<AuditoriaModel> = await this.servicioAuditoria.consultarXfiltro(`?id_usuario_busqueda=${ this.usuario.id_usuario }`);
      if (listAuditorias_) {
        listAuditorias_.forEach(a => {
          a.fecha_cumplimiento = this.obtenerFechaCorta(a.fecha_cumplimiento);
          const fecha = a.fecha_cumplimiento.split('-');
          const fechaCump = new Date(fecha[0] + '/' + fecha[1] + '/' + fecha[2]);
          const fechaactual = new Date();
          //a.fecha_recepcion = this.obtenerFechaCorta(a.fecha_recepcion);
          const diffDays = Math.floor((Date.UTC(fechaCump.getFullYear(), fechaCump.getMonth(), fechaCump.getDate()) - Date.UTC(fechaactual.getFullYear(), fechaactual.getMonth(), fechaactual.getDate())) / (1000 * 60 * 60 * 24));
          a.dias_restantes = diffDays;

        });
        //this.listAuditorias = listAuditorias_.sort((a, b) => Number(a.dias_restantes) - Number(b.dias_restantes));

        this.listAuditorias = listAuditorias_;
      }
      //this.dtOptions.order = ['4', 'asc']; // Se ordena ascendente por dias restantes
      this.dtTrigger.next();
    } else {
      let listAuditorias_: Array<AuditoriaModel> = await this.servicioAuditoria.consultar();
      if (listAuditorias_) {
        listAuditorias_.forEach(a => {
          a.fecha_cumplimiento = this.obtenerFechaCorta(a.fecha_cumplimiento);
          const fecha = a.fecha_cumplimiento.split('-');
          const fechaCump = new Date(fecha[0] + '/' + fecha[1] + '/' + fecha[2]);
          const fechaactual = new Date();
          //a.fecha_recepcion = this.obtenerFechaCorta(a.fecha_recepcion);
          const diffDays = Math.floor((Date.UTC(fechaCump.getFullYear(), fechaCump.getMonth(), fechaCump.getDate()) - Date.UTC(fechaactual.getFullYear(), fechaactual.getMonth(), fechaactual.getDate())) / (1000 * 60 * 60 * 24));
          a.dias_restantes = diffDays;
        });
        this.listAuditorias = listAuditorias_;
      } 
      //this.listAuditorias = listAuditorias_.sort((a, b) => Number(a.dias_restantes) - Number(b.dias_restantes));
      
      
      //this.dtOptions.order = ['4', 'asc']; // Se ordena ascendente por dias restantes 
      this.dtTrigger.next();
    }
  }

  public obtenerFechaCorta(fecha: string): string {
    const stringFecha = fecha.split(' ');
    const Fecha_ = stringFecha[0];
    return Fecha_;
  }

  async actualizarAuditorias() {

    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      await this.consultarAuditorias();
    });
  }

  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();
  }

}
