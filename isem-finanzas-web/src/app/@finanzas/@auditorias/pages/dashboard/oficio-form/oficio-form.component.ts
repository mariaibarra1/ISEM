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
import { OficioModel } from '../../../models/oficio.model';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { OficioService } from '../../../services/oficio.service';
import { ProrrogaFormComponent } from '../prorroga-form/prorroga-form.component';
import { ResponsableRequerimientoModel } from '../../../models/requerimiento-asignado.model';
import { RequerimientoAsignadoService } from '../../../services/requerimientoAsignado.service';


@Component({
  selector: 'app-oficio-form',
  templateUrl: './oficio-form.component.html',
  styleUrls: ['./oficio-form.component.scss']
})
export class OficioFormComponent implements OnInit {

  public accion: string;
  public tittle: string;
  public location: Location;
  public oficio: OficioModel = new OficioModel();
  public auditoria: AuditoriaModel;
  public listRequerimientos: Array<RequerimientoModel> = [];
  public listAreasRemitente: Array<RemitenteModel> = [];
  //public listPersonasRemitente: Array<RemitenteModel> = [];
  public listPersonasRemitente: Array<UsuarioModel> = [];


  public requerimientoAuxiliar: RequerimientoModel;
  public usuario: UsuarioModel;
  public guardando: boolean = false;

  fecha_recepcion_: NgbDate;
  fecha_cumplimiento_: NgbDate;

  modal: NgbModalRef;

  public tipoAdjunto: TipoAdjuntoModel;
  public listTiposAdjunto: Array<TipoAdjuntoModel> = [];
  public listAdjuntos: Array<AdjuntoModel> = [];
  public archivo: File = null;
  public tipoSeleccionado = false;


  constructor(
    location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private servicioRemitentes: RemitenteService,
    private servicioAdjuntos: AdjuntoService,
    private servicioRequerimiento: RequerimientoService,
    private servicioUsuarios: UsuarioService,
    private servicioOficios: OficioService,
    public toastService: ToastService,
    private servicioTiposAdjunto: TipoAdjuntoService,
    private servicioRequerimientoAsignado: RequerimientoAsignadoService,

  ) {

    this.location = location;
    this.accion = this.route.snapshot.routeConfig.path;


    this.oficio = new OficioModel();
    this.auditoria = new AuditoriaModel();
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }



  async ngOnInit() {

    this.listAreasRemitente = await this.consultarAreasRemitente();
    this.listPersonasRemitente = await this.consultarUsuarios();
    this.listTiposAdjunto = await this.consultarTiposAdjunto();

    if (this.accion == "agregarOficio") {
      this.tittle = 'Agregar';

      this.auditoria = this.route.snapshot.params;
      this.oficio.id_auditoria = Number(this.auditoria.id_auditoria);
      this.oficio.id_oficio = 0;
    } else {
      this.tittle = 'Editar';

      let oficio_ = this.route.snapshot.params;
      let listoficio = await this.consultarOficio(Number(oficio_.id_oficio));
      await this.consultarAdjuntos(oficio_.id_oficio);

      this.oficio = listoficio[0];

      //this.oficio.id_oficio = Number(oficio_.id_oficio);
      //this.oficio.id_auditoria = Number(oficio_.id_auditoria);
      //this.oficio.num_oficio = oficio_.num_oficio;
      //this.oficio.fecha_recepcion = oficio_.fecha_recepcion;
      //this.oficio.fecha_cumplimiento = oficio_.fecha_cumplimiento;
      //this.oficio.id_area_remitente = Number(oficio_.id_area_remitente);
      //this.oficio.id_persona_remitente = Number(oficio_.id_persona_remitente);
      //this.oficio.descripcion = oficio_.descripcion;
      //this.oficio.id_estatus = oficio_.id_estatus;

      this.auditoria.id_auditoria = this.oficio.id_auditoria;
      this.auditoria.nombre_auditoria = this.oficio.nombre_auditoria;

      //Inicializar fechas
      this.fecha_recepcion_ = this.obtenerFecha(this.oficio.fecha_recepcion);
      this.fecha_cumplimiento_ = this.obtenerFecha(this.oficio.fecha_cumplimiento);
      //

      if (this.usuario.id_rol == 10) {
        await this.consultarRequerimientosUsuario(this.usuario.id_usuario);

      } else {
        await this.consultarRequerimientos();
      }
      this.consultarAcciones();

    }

  }

  public async consultarTiposAdjunto() {
    const respuesta: any = await this.servicioTiposAdjunto.consultar();
    return respuesta;
  }

  public consultarAcciones() {

    this.listRequerimientos.forEach((element) => {

      if (this.usuario.id_rol == 8) {
        if (element.id_estatus == 2) {
          element.accion = 'editar';
        }
        else {
          element.accion = 'visualizar';
        }
      }
      else if (this.usuario.id_rol == 9) {
        if (element.id_estatus == 12 || element.id_estatus == 14 || element.id_estatus == 17) {
          element.accion = 'editar';
        } else {
          element.accion = 'visualizar';
        }
      }
      else if (this.usuario.id_rol == 10) {
        if (element.aceptado) { //Si el rol es area resolvedora y el requerimiento ya fue aceptado se visualizan las opciones
          if (element.id_estatus == 13 || element.id_estatus == 16) {
            element.accion = 'editar';
          } else {
            element.accion = 'visualizar';
          }
        }
      }
      else if (this.usuario.id_rol == 11) {
        if (element.id_estatus == 15 || element.id_estatus == 18) {
          element.accion = 'visualizar';
        } else {
          element.accion = 'editar';
        }
      }
    });



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


  public async consultarUsuarios() {
    const respuesta: any = await this.servicioUsuarios.consultar('');
    return respuesta;
  }

  public async consultarAreasRemitente() {
    const respuesta: any = await this.servicioRemitentes.consultar('?tipo=1');
    return respuesta;
  }

  public async consultarOficio(id_oficio: number) {
    const respuesta: any = await this.servicioOficios.consultar('?id_oficio=' + id_oficio);
    return respuesta;
  }



  public async consultarRequerimientos() {

    const respuesta: any = await this.servicioRequerimiento.consultar('?id_oficio=' + this.oficio.id_oficio);

    if (respuesta != null) {
      let i: number;
      let j: number;


      for (i = 0; i < respuesta.length; i++) {

        let listAsignados: Array<ResponsableRequerimientoModel> = [];
        listAsignados = JSON.parse(respuesta[i].lista_asignados);
        if (listAsignados) {
        for (j = 0; j < listAsignados.length; j++) {
            if (j === 0) {
              respuesta[i].asignados = listAsignados[j].nombre_asignado;
            } else {
              respuesta[i].asignados = respuesta[i].asignados + ', ' + listAsignados[j].nombre_asignado;
            }
          }
        }
      }
      return this.listRequerimientos = respuesta;
      }

    }

  public async consultarRequerimientosUsuario(id_usuario: number) {

    const respuesta: any = await this.servicioRequerimiento.consultar('?id_oficio=' + this.oficio.id_oficio + '&id_usuario_requerimiento=' + id_usuario);

    if (respuesta != null) {
      let i: number;
      let j: number;


      for (i = 0; i < respuesta.length; i++) {

        let listAsignados: Array<ResponsableRequerimientoModel> = [];
        listAsignados = JSON.parse(respuesta[i].lista_asignados);
        if (listAsignados) {
          for (j = 0; j < listAsignados.length; j++) {

            if (j === 0) {
              respuesta[i].asignados = listAsignados[j].nombre_asignado;
            } else {
              respuesta[i].asignados = respuesta[i].asignados + ', ' + listAsignados[j].nombre_asignado;
            }
          }
        }
      }
      return this.listRequerimientos = respuesta;
    }
  }

  async aceptarRequerimiento(id_requerimiento_asignado: number) {


    const requerimiento_asignado = new ResponsableRequerimientoModel();
    requerimiento_asignado.id_requerimiento_asignado = id_requerimiento_asignado;
    requerimiento_asignado.accion = 2; //'Aceptar'
    requerimiento_asignado.aceptado = true;

    const respuesta = await this.servicioRequerimientoAsignado.modificar(requerimiento_asignado);
    if (respuesta) {
      if (Number(respuesta) > 0) {
        if (this.usuario.id_rol == 10) {
          await this.consultarRequerimientosUsuario(this.usuario.id_usuario);
          this.consultarAcciones();

        } else {
          await this.consultarRequerimientos();
          this.consultarAcciones();
        }
        this.toastService.show('Se aceptó el requerimiento ', { classname: 'bg-success text-light', delay: 3000 });

      } else {

        this.toastService.show('Error al actualizar ', { classname: 'bg-danger  text-light', delay: 3000 });
      }
    }

  }

  async rechazarRequerimiento(id_requerimiento_asignado: number) {
    const requerimiento_asignado = new ResponsableRequerimientoModel();
    requerimiento_asignado.id_requerimiento_asignado = id_requerimiento_asignado;
    requerimiento_asignado.accion = 3; //'Rechazar'
    requerimiento_asignado.aceptado = false; //'Aceptar'

    const respuesta = await this.servicioRequerimientoAsignado.modificar(requerimiento_asignado);
    if (respuesta) {
      if (Number(respuesta) > 0) {
        if (this.usuario.id_rol == 10) {
          await this.consultarRequerimientosUsuario(this.usuario.id_usuario);
          this.consultarAcciones();
        } else {
          await this.consultarRequerimientos();
          this.consultarAcciones();
        }
        this.toastService.show('Se rechazó el requerimiento ', { classname: 'bg-success text-light', delay: 3000 });

      } else {

        this.toastService.show('Error al actualizar ', { classname: 'bg-danger  text-light', delay: 3000 });
      }
    }
  }

  agregarRequerimiento() {
    let requerimiento = new RequerimientoModel();
    requerimiento.id_requerimiento = 0;
    requerimiento.id_oficio = this.oficio.id_oficio;
    this.router.navigate(['/finanzas/auditorias/dashboard/agregarRequerimiento', requerimiento]);
  }

  redireccionAuditoria() {
    let auditoria = new AuditoriaModel();
    auditoria.id_auditoria = this.oficio.id_auditoria;
    this.router.navigate(['/finanzas/auditorias/dashboard/editar', auditoria]);
  }

  //abrirModal(requerimiento: RequerimientoModel) {
  //  this.modal = this.modalService.open(RequerimientosFormComponent, { size: 'lg', backdrop: 'static'/* , scrollable: true */ });

  //  if (requerimiento != null) {
  //    this.modal.componentInstance.requerimientoInput = requerimiento;
  //    this.modal.componentInstance.oficioInput = this.oficio;
  //    this.modal.componentInstance.accion = "Editar";
  //  } else {
  //    //this.modal.componentInstance.requerimientoInput = this.requerimiento;
  //    let req_nuevo = new RequerimientoModel();

  //    //req_nuevo.id_auditoria = this.oficio.id_auditoria;
  //    req_nuevo.id_oficio = this.oficio.id_oficio;
  //    this.modal.componentInstance.requerimientoInput = req_nuevo;

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
  //      //this.listRequerimientos.push(this.requerimientoAuxiliar);
  //      this.consultarRequerimientos();
  //      //this.toastService.show('Agregado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
  //    } else {
  //      this.consultarRequerimientos();
  //      //this.toastService.show('Se guardaron los cambios', { classname: 'bg-success text-light', delay: 3000 });
  //    }
  //  });

  //}
  abrirModalProrroga() {
    this.modal = this.modalService.open(ProrrogaFormComponent, { size: 'lg', backdrop: 'static'});

    this.modal.componentInstance.oficioInput = this.oficio;

    this.modal.componentInstance.prorrogaOutput.subscribe((prorrogaOutput) => {
      if (prorrogaOutput === 'cerrar') {
        this.modal.dismiss();
      } else {
        this.fecha_cumplimiento_ = prorrogaOutput as NgbDate;
        this.modal.dismiss();
      }
    });
  }




  public async guardarOficio(form: NgForm) {

    this.guardando = true;
    if (form.valid) {

      var fechaRecepcion = this.fecha_recepcion_;
      var fechaCumplimiento = this.fecha_cumplimiento_;
      this.oficio.fecha_recepcion = fechaRecepcion.year + '-' + (fechaRecepcion.month <= 9 ? '0' + fechaRecepcion.month : fechaRecepcion.month) + '-' + (fechaRecepcion.day <= 9 ? '0' + fechaRecepcion.day : fechaRecepcion.day);
      this.oficio.fecha_cumplimiento = fechaCumplimiento.year + '-' + (fechaCumplimiento.month <= 9 ? '0' + fechaCumplimiento.month : fechaCumplimiento.month) + '-' + (fechaCumplimiento.day <= 9 ? '0' + fechaCumplimiento.day : fechaCumplimiento.day);
      this.oficio.activo = true;
      this.oficio.id_estatus = 2;
      this.oficio.id_usuario_oficio = this.usuario.id_usuario;

      let respuesta: any = await this.servicioOficios.agregar(this.oficio);

      if (respuesta) {
        if (Number(respuesta) > 0) {
          this.toastService.show('Se agregó el oficio correctamente ', { classname: 'bg-success text-light', delay: 1500 });
          this.oficio.id_oficio = Number(respuesta);
          await this.guardarAdjuntos();
        } else {
          this.guardando = false;
          console.log(respuesta);
          this.toastService.show('Error al agregar ', { classname: 'bg-danger  text-light', delay: 1500 });
        }
      }

    } else {
      this.guardando = false;
      this.toastService.show('Formulario invalido ', { classname: 'bg-danger  text-light', delay: 3000 });
    }
  }
  public async modificarOficio() {
    this.guardando = true;
    this.oficio.id_usuario_oficio = this.usuario.id_usuario;
    this.oficio.solicitar_prorroga = false;
    let respuesta: any;
    if (this.oficio.id_estatus === 2) {
      this.oficio.id_estatus = 12;
      respuesta = await this.servicioOficios.modificar(this.oficio);
    } else if (this.oficio.id_estatus === 12) {
      if (this.validarTurnado) {
        this.oficio.id_estatus = 18;
        respuesta = await this.servicioOficios.modificar(this.oficio);
      }
    }
    if (respuesta) {
      if (Number(respuesta) > 0) {
        this.consultarRequerimientos();
        this.toastService.show('El oficio fue turnado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
        this.oficio.id_oficio = Number(respuesta);
        this.router.navigate(['/finanzas/auditorias/']);
      } else {
        console.log(respuesta);
        this.guardando = false;
        this.toastService.show('Error al turnar ', { classname: 'bg-danger  text-light', delay: 3000 });
      }
    }
  }

  validarFormulario(form: NgForm): boolean {
    if (form.valid && this.listRequerimientos.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  existeOficio(): boolean {
    if (this.oficio.id_oficio > 0) {
      return true;
    }

    return false;
  }

  validarTurnado(): boolean {
    if (this.oficio.id_estatus === 2) {
      if  (this.listRequerimientos.length > 0) {
        return true;
      } else {
        return false;
      }
    } else if (this.oficio.id_estatus === 12) {
      let result = true;
      if (this.listRequerimientos.length > 0) {
        this.listRequerimientos.forEach(req => {
          if ( req.id_estatus !== 15 ) {
            result = false;
          }});
        return result;
      } else {
        return false;
      }
    }
  }
  validarProrroga(): boolean {
    //let revicion = 0;
    let reqinvalid:boolean = false;
    if (this.oficio.id_estatus === 12) {
      if (this.listRequerimientos.length > 0) {

        if (this.validarTurnado()) { //Cuando todos los requerimientos esten en proceso-revision
          return false;
        }

        this.listRequerimientos.forEach(req => {
          if (!(req.id_estatus >= 14) && (req.id_estatus < 18)) {
              reqinvalid = true;
          }});
        if (!reqinvalid) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }
    return false;
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
    } else {
      return false;
    }
  }
  existenAdjuntos() {
    return this.listAdjuntos.length > 0;
  }

  seleccionarTipoAdjunto() {
    this.tipoSeleccionado = true;
  }

  onClick() {
    const inputFile = document.getElementById('adjunto') as HTMLInputElement;
    inputFile.click();
  }
  async agregarAdjunto(archivo: FileList) {
    let stringBase64;

    this.archivo = archivo.item(0);
    if (this.archivo != null) {
      stringBase64 = await this.toBase64(this.archivo) as string;
    }

    this.listAdjuntos.push({
      nombre: this.archivo.name,
      tamanio: this.archivo.size.toString(),
      tipo: this.archivo.type,
      tipo_nombre: this.tipoAdjunto.nombre,
      id_tipo_adjunto: this.tipoAdjunto.id_tipo_adjunto,
      base64: stringBase64
    });

    this.tipoSeleccionado = true;

  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  eliminarAdjunto(adjunto: AdjuntoModel) {
    const index = this.listAdjuntos.indexOf(adjunto);
    this.listAdjuntos.splice(index, 1);
  }

  async guardarAdjuntos() {
    let errorAdjunto = false;

    let lista_adjuntos_nuevos: Array<AdjuntoModel>; // Solo adjuntos nuevos.
    lista_adjuntos_nuevos = this.listAdjuntos.filter(x => x.id_adjunto == null);

    for (let i = 0; i < lista_adjuntos_nuevos.length; i++) {
      lista_adjuntos_nuevos[i].id_oficio = this.oficio.id_oficio;
    }

    const respuestaAdjuntos: Array<string> = await this.servicioAdjuntos.agregarList(lista_adjuntos_nuevos);

    for (let i = 0; i < respuestaAdjuntos.length; i++) {
      if (respuestaAdjuntos[i] !== '1') {
        errorAdjunto = true;
      }
    }

    if (!errorAdjunto) {
      await this.consultarAdjuntos(this.oficio.id_oficio);
      console.log(respuestaAdjuntos);
      this.toastService.show('El adjunto se cargo correctamente ', { classname: 'bg-success text-light', delay: 1500 });
    } else {
      console.log(respuestaAdjuntos);
      this.toastService.show('Ocurrio un error al cargar el adjunto ', { classname: 'bg-danger  text-light', delay: 1500 });
    }
  }


  public async consultarAdjuntos(id_oficio: number) {
    const respuesta: any = await this.servicioAdjuntos.consultar('?id_oficio=' + id_oficio);
    if (respuesta !== null) {
      return this.listAdjuntos = respuesta;
    }
  }
}
