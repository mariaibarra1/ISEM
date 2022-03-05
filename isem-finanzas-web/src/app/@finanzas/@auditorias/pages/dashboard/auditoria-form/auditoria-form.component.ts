import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EnteFiscalModel } from '../../../models/ente-fiscal.model';
import { EnteFiscalService } from '../../../services/ente-fiscal.service';
import { RemitenteModel } from '../../../models/remitente.model';
import { RemitenteService } from '../../../services/remitente.service';
import { TipoAdjuntoModel } from '../../../models/tipo-adjunto.model';
import { TipoAdjuntoService } from '../../../services/tipo-adjunto.service';
import { TipoRecepcionModel } from '../../../models/tipo-recepcion.model';
import { TipoRecepcionService } from '../../../services/tipo-recepcion.service';
import { AuditoriaModel } from '../../../models/auditoria.model';
import { AuditoriaService } from '../../../services/auditoria.service';
import { AdjuntoModel } from '../../../models/adjunto.model';
import { AdjuntoService } from '../../../services/adjunto.service';
import { RequerimientoModel } from '../../../models/requerimiento.model';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { NgbModal, NgbModalRef, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { VerAdjuntosComponent } from 'src/app/@finanzas/@common/pages/verAdjuntos/verAdjuntos.component';
import { ToastService } from '../../../../@common/services/toast-service';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { OficioModel } from '../../../models/oficio.model';
import { OficioService } from '../../../services/oficio.service';


@Component({
  selector: 'app-auditoria-form',
  templateUrl: './auditoria-form.component.html',
  styleUrls: ['./auditoria-form.component.scss']
})
export class AuditoriaFormComponent implements OnInit {

  public tittle: string;
  public accion: string;
  public auditoria: AuditoriaModel;
  public tipoAdjunto: TipoAdjuntoModel;

  public archivo: File = null;
  public idAuditoria: number;
  public listFiscal: Array<EnteFiscalModel> = [];
  public listAreasRemitente: Array<RemitenteModel> = [];
  public listPersonasRemitente: Array<UsuarioModel> = [];
  public listTiposAdjunto: Array<TipoAdjuntoModel> = [];
  public listTiposRecepcion: Array<TipoRecepcionModel> = [];
  public listAdjuntos: Array<AdjuntoModel> = [];
  public listOficios: Array<OficioModel> = [];
  public tipoSeleccionado: boolean = false;
  public usuario: UsuarioModel;
  public guardando: boolean = false;

  //public listRequerimientos: Array<RequerimientoModel> = [];
  //public listRequerimientosEditados: Array<RequerimientoModel> = [];
  // public requerimiento: RequerimientoModel;
  //public requerimientoAuxiliar: RequerimientoModel;



  fecha_recepcion_: NgbDate;
  fecha_cumplimiento_: NgbDate;

  inicio_revision_: NgbDate;
  fin_revision_: NgbDate;


  modal: NgbModalRef;
  location: Location;

  @ViewChild('VerAdjuntos', { static: true, read: VerAdjuntosComponent }) verAdjuntosComponent: VerAdjuntosComponent;

  constructor(
    location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private servicioEntesFiscales: EnteFiscalService,
    private servicioRemitentes: RemitenteService,
    private servicioTiposRecepcion: TipoRecepcionService,
    private servicioAuditoria: AuditoriaService,
    private servicioUsuarios: UsuarioService,
    private servicioOficios: OficioService,
    public toastService: ToastService
    //private servicioAdjuntos: AdjuntoService,
    //private servicioRequerimiento: RequerimientoService,
    //private servicioTiposAdjunto: TipoAdjuntoService,
  ) {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));

    this.tipoAdjunto = new TipoAdjuntoModel();
    //this.requerimiento = new RequerimientoModel();

    this.accion = this.route.snapshot.routeConfig.path;
    this.location = location;

    if (this.accion === 'editar') {
      this.tittle = 'Editar';

      this.auditoria = this.route.snapshot.params;
      this.consultarOficios();
      // this.requerimiento = new RequerimientoModel();
     // this.consultarRequerimientos();
      //this.consultarAdjuntos();
    } else {
      this.tittle = 'Agregar';
      this.auditoria = new AuditoriaModel();
    }

    this.idAuditoria = Number(this.auditoria.id_auditoria);
  }

  async ngOnInit() {
    if (this.accion === 'editar') {
      //Inicializar fechas
      let auditoria_ = this.route.snapshot.params;
      let listauditoria = await this.consultarAuditoria(Number(auditoria_.id_auditoria));
      this.auditoria = listauditoria[0];


      this.fecha_recepcion_ = this.obtenerFecha(this.auditoria.fecha_recepcion);
      this.fecha_cumplimiento_ = this.obtenerFecha(this.auditoria.fecha_cumplimiento);
      this.inicio_revision_ = this.obtenerFecha(this.auditoria.inicio_revision);
      this.fin_revision_ = this.obtenerFecha(this.auditoria.fin_revision);
      //
    }
    this.listTiposRecepcion = await this.consultarTiposRecepcion();
    this.listFiscal = await this.consultarEntesFiscales();
    this.listAreasRemitente = await this.consultarAreasRemitente();
    this.listPersonasRemitente = await this.consultarUsuarios();
    //this.listTiposAdjunto = await this.consultarTiposAdjunto();
  }

  public obtenerFecha(fecha: string): NgbDate {
    const stringFecha = fecha.split('-');
    const dia = stringFecha[2];
    var objFecha = {
      year: Number(stringFecha[0]),
      month: Number(stringFecha[1]),
      day: Number(dia.substring(0, 2))
    };
    let Fecha: NgbDate = new NgbDate(objFecha.year, objFecha.month, objFecha.day);
    return Fecha;
  }

  public async consultarEntesFiscales() {
    const respuesta: any = await this.servicioEntesFiscales.consultar();
    if (respuesta.length >= 1) {
      return respuesta;
    }
  }

  public async consultarAreasRemitente() {
    const respuesta: any = await this.servicioRemitentes.consultar('?tipo=1');
    return respuesta;
  }

  public async consultarUsuarios() {
    const respuesta: any = await this.servicioUsuarios.consultar('');
    return respuesta;
  }


  public async consultarTiposRecepcion() {
    const respuesta: any = await this.servicioTiposRecepcion.consultar();
    return respuesta;
  }

  public async consultarAuditoria(id_auditoria: number) {
    const respuesta: any = await this.servicioAuditoria.consultarXfiltro('?id_auditoria=' + id_auditoria);
    return respuesta;
  }

  public async consultarOficios() {
    if (this.usuario.id_rol === 10) {
      // tslint:disable-next-line: max-line-length
      const respuesta: any = await this.servicioOficios.consultar(`?id_auditoria=${ this.auditoria.id_auditoria }&id_usuario_busqueda=${ this.usuario.id_usuario }`);
      if (respuesta.length != null) {
        return this.listOficios = respuesta;
      }
    } else {
      const respuesta: any = await this.servicioOficios.consultar('?id_auditoria=' + this.auditoria.id_auditoria);
      if (respuesta.length != null) {
        return this.listOficios = respuesta;
      }
    }
  }

  redireccionDashboardAuditoria() {
    this.router.navigate(['/finanzas/auditorias/dashboard']);
  }



  public async guardarAuditoria(form: NgForm) {
    this.guardando = true;
    if (form.valid) {
      var fechaRecepcion = form.value.fecha_recepcion;
      var fechaCumplimiento = form.controls.fecha_cumplimiento.value;
      var inicioRevision = form.controls.inicio_revision.value;
      var finRevision = form.controls.fin_revision.value;
      this.auditoria.fecha_recepcion = fechaRecepcion.year + '-' + (fechaRecepcion.month <= 9 ? '0' + fechaRecepcion.month : fechaRecepcion.month) + '-' + (fechaRecepcion.day <= 9 ? '0' + fechaRecepcion.day : fechaRecepcion.day);

      if (fechaCumplimiento) {
        this.auditoria.fecha_cumplimiento = fechaCumplimiento.year + '-' + (fechaCumplimiento.month <= 9 ? '0' + fechaCumplimiento.month : fechaCumplimiento.month) + '-' + (fechaCumplimiento.day <= 9 ? '0' + fechaCumplimiento.day : fechaCumplimiento.day);
      }

      this.auditoria.inicio_revision = inicioRevision.year + '-' + (inicioRevision.month <= 9 ? '0' + inicioRevision.month : inicioRevision.month) + '-' + (inicioRevision.day <= 9 ? '0' + inicioRevision.day : inicioRevision.day);
      this.auditoria.fin_revision = finRevision.year + '-' + (finRevision.month <= 9 ? '0' + finRevision.month : finRevision.month) + '-' + (finRevision.day <= 9 ? '0' + finRevision.day : finRevision.day)




      ////RUBRO ES TEMPORAL
      //for (let i = 0; i < this.listRequerimientos.length; i++) {
      //  //this.listRequerimientos[i].id_auditoria = this.idAuditoria;
      //  this.listRequerimientos[i].id_rubro = 1;
      //}
      ////
      //this.auditoria.lista_requerimientos = JSON.stringify(this.listRequerimientos);

      let respuesta: any = await this.servicioAuditoria.agregar(this.auditoria);

      if (respuesta != null) {
        if (Number(respuesta) > 0) {
          this.idAuditoria = Number(respuesta);

          //if (this.listAdjuntos.length > 0) {
          //  await this.guardarAdjuntos();
          //} else {

          this.toastService.show('Agregado Correctamente ', { classname: 'bg-success text-light', delay: 3000 });
          this.router.navigate(['/finanzas/auditorias/']);
          //}

          //  this.idAuditoria = Number(respuesta);
          //  await this.guardarRequerimientos();
        } else {
          this.guardando = false;
          console.log(respuesta);
          this.toastService.show('Error al agregar ', { classname: 'bg-danger  text-light', delay: 3000 });
        }
      }
    } else {
      this.guardando = false;
      this.toastService.show('Formulario invalido ', { classname: 'bg-danger  text-light', delay: 3000 });
    }
  }

  agregarOficio() {
    this.router.navigate(['/finanzas/auditorias/dashboard/agregarOficio', this.auditoria]);
  }

  validarFechas(): boolean {

    if ((this.fecha_recepcion_ != undefined) && (this.fecha_cumplimiento_ != undefined)) {
      const fechaActual = new Date();
      const fechaRecepcion = new Date(this.fecha_recepcion_.year + '/' + this.fecha_recepcion_.month + '/' + this.fecha_recepcion_.day);
      const fechaCumplimiento = new Date(this.fecha_cumplimiento_.year + '/' + this.fecha_cumplimiento_.month + '/' + this.fecha_cumplimiento_.day);

      if (fechaRecepcion > fechaCumplimiento) {
        return false;
      } else {
        if (fechaCumplimiento > fechaRecepcion && fechaCumplimiento > fechaActual) {
          return true;
        } else {
          false
        };

      }
    } else if ((this.fecha_recepcion_ == undefined) || (this.fecha_cumplimiento_ == undefined)) {
      return true;
    } else {
      return false;
    }
  }

  validarFechasRevision(): boolean {

    if ((this.inicio_revision_ !== undefined) && (this.fin_revision_ !== undefined)) {
      const fechaActual = new Date();
      const inicioRevision = new Date(this.inicio_revision_.year + '/' + this.inicio_revision_.month + '/' + this.inicio_revision_.day);
      const finRevision = new Date(this.fin_revision_.year + '/' + this.fin_revision_.month + '/' + this.fin_revision_.day);
      const fecha_recepcion  = new Date(this.fecha_recepcion_.year + '/' + this.fecha_recepcion_.month + '/' + this.fecha_recepcion_.day);

      if (inicioRevision > finRevision) {
        return false;
      } else if (inicioRevision < fecha_recepcion) {
        return false;
      } else {
        if (finRevision > inicioRevision && finRevision > fechaActual) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  //async guardarRequerimientos() {
  //  for (let i = 0; i < this.listRequerimientos.length; i++) {
  //    this.listRequerimientos[i].id_auditoria = this.idAuditoria;
  //    this.listRequerimientos[i].id_rubro = 1;
  //  }
  //  await this.servicioRequerimiento.agregarList(this.listRequerimientos);
  //  if (this.accion != 'editar') {
  //    await this.guardarAdjuntos();
  //  } else {
  //    this.router.navigate(['/finanzas/auditorias/']);
  //    this.toastService.show('Se actualizó la información ', { classname: 'bg-success text-light', delay: 3000 });
  //  }
  //}

   //public async consultarAdjuntos() {
  //  const respuesta: any = await this.servicioAdjuntos.consultar('?id_auditoria=' + this.auditoria.id_auditoria);
  //  if (respuesta != null)
  //    return this.listAdjuntos = respuesta;
  //}

  //async guardarAdjuntos() {

  //  let exito: boolean = true;

  //  for (let i = 0; i < this.listAdjuntos.length; i++) {
  //    //this.listAdjuntos[i].id_auditoria = this.idAuditoria;
  //  }

  //  const respuesta: Array<string> = await this.servicioAdjuntos.agregarList(this.listAdjuntos);

  //  for (let i = 0; i < respuesta.length; i++) {
  //    if (respuesta[i] != "1") {
  //      exito = false;
  //    }
  //  }

  //  if (exito) {
  //    this.toastService.show('Agregado Correctamente ', { classname: 'bg-success text-light', delay: 3000 });
  //    this.router.navigate(['/finanzas/auditorias/']);
  //  } else {
  //    this.toastService.show('Error al agregar verifica los datos  ', { classname: 'bg-danger  text-light', delay: 3000 });
  //  }
  //}

  //seleccionarTipoAdjunto() {
  //  this.tipoSeleccionado = true;
  //}

  //onClick() {
  //  const inputFile = document.getElementById('adjunto') as HTMLInputElement;
  //  inputFile.click();
  //}

  //async agregarAdjunto(archivo: FileList) {
  //  var stringBase64;

  //  this.archivo = archivo.item(0);
  //  if (this.archivo != null) {
  //    stringBase64 = await this.toBase64(this.archivo) as string;
  //  }

  //  this.listAdjuntos.push({
  //    nombre: this.archivo.name,
  //    tamanio: this.archivo.size.toString(),
  //    tipo: this.archivo.type,
  //    tipo_nombre: this.tipoAdjunto.nombre,
  //    id_tipo_adjunto: this.tipoAdjunto.id_tipo_adjunto,
  //    base64: stringBase64
  //  });

  //  this.tipoSeleccionado = true;
  //}

  //eliminarAdjunto(adjunto: AdjuntoModel) {
  //  const index = this.listAdjuntos.indexOf(adjunto);
  //  this.listAdjuntos.splice(index, 1);
  //}

  //existenAdjuntos() {
  //  return this.listAdjuntos.length > 0;
  //}

  //abrirModal(requerimiento: RequerimientoModel) {
  //  this.modal = this.modalService.open(RequerimientosFormComponent, { size: 'lg', backdrop: 'static' });

  //  if (requerimiento != null) {
  //    this.modal.componentInstance.requerimientoInput = requerimiento;
  //    this.modal.componentInstance.accion = "Editar";
  //  } else {
  //    //this.modal.componentInstance.requerimientoInput = this.requerimiento;
  //    this.modal.componentInstance.requerimientoInput = new RequerimientoModel();//vacio
  //    this.modal.componentInstance.accion = "Agregar";
  //  }


  //  this.modal.componentInstance.requerimientoOutput.subscribe((requerimientoOutput) => {
  //    if (requerimientoOutput === 'cerrar') {
  //      this.modal.dismiss();
  //    } else {
  //      this.requerimientoAuxiliar = requerimientoOutput as RequerimientoModel;
  //      this.modal.dismiss();
  //    }
  //  });

  //  //Se agrego este output para saber si es nuevo registro(Local)
  //  this.modal.componentInstance.accionOutput.subscribe((operacion) => {
  //    if (operacion == 'Agregar') {
  //      this.listRequerimientos.push(this.requerimientoAuxiliar);
  //    }
  //  });

  //}

  //async eliminarRequerimiento(requerimiento: RequerimientoModel) {
  //  if (requerimiento.id_requerimiento != null && requerimiento.id_requerimiento > 0) {
  //    await this.servicioRequerimiento.eliminar('?id_requerimiento=' + requerimiento.id_requerimiento);
  //  }
  //  const index = this.listRequerimientos.indexOf(requerimiento);
  //  this.listRequerimientos.splice(index, 1);
  //}

  //existenRequerimientos() {
  //  return this.listRequerimientos.length > 0;
  //}

  //toBase64 = file => new Promise((resolve, reject) => {
  //  const reader = new FileReader();
  //  reader.readAsDataURL(file);
  //  reader.onload = () => resolve(reader.result);
  //  reader.onerror = error => reject(error);
  //});



  //public async consultarRequerimientos() {
  //  const respuesta: any = await this.servicioRequerimiento.consultar('?id_auditoria=' + this.auditoria.id_auditoria);
  //  if (respuesta != null)
  //    return this.listRequerimientos = respuesta;
  //}

    //public async consultarPersonasRemitente() {
  //  const respuesta: any = await this.servicioRemitentes.consultar('?tipo=2');
  //  return respuesta;
  //}

  //public async consultarTiposAdjunto() {
  //  const respuesta: any = await this.servicioTiposAdjunto.consultar();
  //  return respuesta;
  //}

}
