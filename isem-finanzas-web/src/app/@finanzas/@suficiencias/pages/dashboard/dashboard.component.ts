import { Component, OnDestroy, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { ThemeConstants } from '../../../../@espire/shared/config/theme-constant';
import { SufienciaService } from '../services/suficiencia.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RecursoService } from '../services/recurso.service';
import { RemitenteService } from '../services/remitente.service';
import { Router } from '@angular/router';
import { RemitenteModel } from 'src/app/@finanzas/@auditorias/models/remitente.model';
import { RecursoModel } from '../models/recurso.model';
import { SuficienciaModel } from '../models/suficiencia.model';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { PartidaFF } from '../models/partida.model';
import { values } from 'd3';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { ObservacionModel, Observacio } from '../models/observacion.model';
import { ToastService } from 'src/app/@finanzas/@common/services/toast-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public closeResult = '';


  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  public observacionCancelacion = new ObservacionModel();

  public rows = [];
  public busqueda = false;

  public respuesta = false;

  public suficiencia = new SuficienciaModel();
  public model = new SuficienciaModel();

  public usuario;
  public listRemitente: Array<RemitenteModel> = [];
  public listRecursos: Array<RecursoModel> = [];
  public listSuficiencia: Array<SuficienciaModel> = [];

  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private themeConstants: ThemeConstants,
    private suficienciaservice: SufienciaService,
    private servicioRecursos: RecursoService,
    private servicioRemitentes: RemitenteService,
    private router: Router,
    public toastService: ToastService,
    private _matDialog: NgbModal,
    private servicioSuficiencia: SufienciaService,

  ) { this.usuario = JSON.parse(localStorage.getItem('usuario')); }

  async ngOnInit(): Promise<void> {

    this.dtOptions = this.themeConstants.dtOptions;

    await this.obtenerSuficiencias();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public obtenerFiltro() {

    let filtro: number[];

    if (this.usuario.id_rol !== 1) {
      switch (this.usuario.id_rol) {
        case 2: { // enum_ca_roles.tesoreria
          filtro = [4, 6, 8]; // enum_estatus_suficiencias.recepcion;
          // filtro = 6;  enum_estatus_suficiencias.validacion;
          // filtro = 8; //enum_estatus_suficiencias.aprobada;
          break;
        }
        case 3: { // enum_ca_roles.presupuesto;
          filtro = [5, 20]; // enum_estatus_suficiencias.proceso;
          break;
        }
        case 4: { // enum_ca_roles.finanzas
          filtro = [7]; // enum_estatus_suficiencias.firma;
          break;
        }
        case 5: { // enum_ca_roles.materiales
          filtro = [9]; // enum_estatus_suficiencias.entrega;
          break;
        }
        default: {
          filtro = [2];  // enum_estatus_suficiencias.registrada;
          break;
        }
      }
    } else {
      filtro = [0];
    }

    return filtro;
  }

  public async obtenerSuficiencias() {
    const filtro = this.obtenerFiltro();

    let suficiencias = await this.suficienciaservice.consultarAsync('suficiencias/Consultar') as SuficienciaModel[];


    if (filtro[0] !== 0) {
      let x = suficiencias.filter(s => s.id_usuario === this.usuario.id_usuario && s.id_estatus === 2 || s.id_usuario_estatus === this.usuario.id_usuario);


      suficiencias = suficiencias.filter((s, i) => {
        filtro.includes(s.id_estatus)
        if (s.id_estatus == 5 && s.id_usuario_estatus != this.usuario.id_usuario) { suficiencias.splice(i, 1); }
      });
      x.forEach(x => suficiencias.push(x));
    }



    suficiencias.forEach(async (element, index) => {

      if (element.fecha_limite !== null) {
        const fecha = element.fecha_limite.split('-');
        const fechalimite = new Date(fecha[1] + '/' + fecha[0] + '/' + fecha[2]);
        const fechaactual = new Date();
        // tslint:disable-next-line:max-line-length
        const diffDays = Math.floor((Date.UTC(fechalimite.getFullYear(), fechalimite.getMonth(), fechalimite.getDate()) - Date.UTC(fechaactual.getFullYear(), fechaactual.getMonth(), fechaactual.getDate())) / (1000 * 60 * 60 * 24));
        element.fecha_limite = '' + diffDays;

        if (diffDays === 0) {
          const listObservaciones: Array<ObservacionModel> = [];
          const obs = new Observacio();
          obs.id_suficiencia = element.id_suficiencia;
          obs.observacion = 'Cancelada por inactivadad';
          listObservaciones.push(obs);
          element.id_estatus = 11;
          element.observacion = JSON.stringify(listObservaciones);
          const data = await this.servicioSuficiencia.ModificarAsync('suficiencias/modificar', element);

        }

      }

      if (element.fuentes_financiamiento !== null) {
        const listFF = JSON.parse(element.fuentes_financiamiento) as PartidaFF[];
        if (listFF !== null) {
          element.nombre_partida = listFF[0].concepto_partida;
          element.nombre_fuente = listFF[0].fuente_financiamiento;
        }
      }

    });

    this.rows = suficiencias;
    this.dtTrigger.next();

  }

  public actualizarSuficiencias() {

    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      await this.obtenerSuficiencias();
    });
  }




  public abrirbusqueda(content: any) {

    this._matDialog.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then(async (result) => {



      const form = result as NgForm;

      const fechaRecepcion = form.controls.fecha_recepcion.value;
      const fecha_liberacion = form.controls.fecha_liberacion.value;
      // const model: SuficienciaModel = {
      //   id: +form.controls.recurso.value ? +form.controls.recurso.value : null,
      //   id_remitente: +form.controls.remitente.value ? +form.controls.remitente.value : null,
      //   documento: +form.controls.oficio.value ? +form.controls.oficio.value : null,
      //   asunto: form.controls.asunto.value ? form.controls.asunto.value : null,
      //   monto: +form.controls.monto.value ? +form.controls.monto.value : null,
      //   partida: +form.controls.partida.value ? +form.controls.partida.value : null,
      //   turnado: +form.controls.turnado.value ? +form.controls.turnado.value : null,
      //   fecha_turno: +form.controls.fecha_turno.value ? +form.controls.fecha_turno.value : null,
      //   fecha_recepcion: fechaRecepcion ? fechaRecepcion.day + '-' + fechaRecepcion.month + '-' + fechaRecepcion.year : null,
      //   fecha_liberacion: fecha_liberacion ? fecha_liberacion.day + '-' + fecha_liberacion.month + '-' + fecha_liberacion.year : null,
      //   sp: +form.controls.sp.value ? +form.controls.sp.value : null,
      //   observaciones: form.controls.observaciones.value ? form.controls.observaciones.value : null,
      //   id_estatus_suficiencia: null
      // };
      // this.buscarxfiltro(model);
    }, (reason) => {
      //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });



  }



  public buscarxfiltro(model: SuficienciaModel) {
    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.busqueda = true;
      this.limpiarForm();
      this.rows = await this.suficienciaservice.BusquedaAsync('suficiencias/ConsultarxFiltro', model);
      this.dtTrigger.next();
    });
  }

  public limpiarForm() {

    this.suficiencia = new SuficienciaModel();

  }

  public limpiarbusqueda() {

    this.dtElement.dtInstance.then(async (dtInstance: DataTables.Api) => {

      dtInstance.destroy();

      this.busqueda = false;
      await this.obtenerSuficiencias();
    });

  }


  public async consultarRecurso() {
    const filtro: RecursoModel = {
      activo: true
    };
    const respuesta: any = await this.servicioRecursos.consultarAsync('catalogos/Recursos/consultar');

    if (respuesta == null || respuesta.success === false) {
      return;
    }
    return respuesta;
  }

  public async consultarRemintentes() {
    const filtro: RemitenteModel = {
      // tipo: enum_ca_tipo_remitente.persona,
      tipo: 2,
      activo: true
    };
    const respuesta: any = await this.servicioRemitentes.consultarAsync('catalogos/Remitentes/consultar');
    if (respuesta == null || respuesta.success === false) {
      return;
    }
    return respuesta;
  }

  VisualizarElemento(suficiencia: SuficienciaModel) {

    this.router.navigate(['Visualizar', { obj: suficiencia }]);
  }




  cancelar(content: any, suficiencia: SuficienciaModel) {

    this._matDialog.open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title' }).result.then(async (result) => {

      const listObservaciones: Array<ObservacionModel> = [];
      const obs = new Observacio();
      obs.id_suficiencia = suficiencia.id_suficiencia;
      obs.observacion = this.observacionCancelacion.observacion;
      listObservaciones.push(obs);


      suficiencia.id_estatus = 11;
      suficiencia.observacion = JSON.stringify(listObservaciones);
      const data = await this.servicioSuficiencia.ModificarAsync('suficiencias/modificar', suficiencia);
      this.observacionCancelacion = new ObservacionModel();
      if (data.status === 1) {

        this.actualizarSuficiencias();

        this.toastService.show('Suficiencia Turnada  Corrrectamente ', { classname: 'bg-success text-light', delay: 5000 });


      } else {
        this.toastService.show('Error al turnar la suficiencia seleccionada ', { classname: 'bg-danger  text-light', delay: 5000 });

      }

    }, (reason) => {

      if (reason === ModalDismissReasons.ESC) {
        this.observacionCancelacion = new ObservacionModel();
        return;
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        this.observacionCancelacion = new ObservacionModel();
        return;
      } else {
        this.observacionCancelacion = new ObservacionModel();
        return;

      }
    });


  }

}
