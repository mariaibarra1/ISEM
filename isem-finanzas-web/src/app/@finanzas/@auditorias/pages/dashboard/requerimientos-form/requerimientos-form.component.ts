import { Component, OnInit, Input, Output, ViewChild, EventEmitter, DebugElement } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { UsuarioModel } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { RequerimientoModel } from '../../../models/requerimiento.model';
import { NgbActiveModal, NgbDate, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RequerimientoService } from '../../../services/requerimiento.service';
import { TipoAdjuntoModel } from '../../../models/tipo-adjunto.model';
import { AdjuntoModel } from '../../../models/adjunto.model';
import { AdjuntoService } from '../../../services/adjunto.service';
import { TipoAdjuntoService } from '../../../services/tipo-adjunto.service';
import { isNumber } from 'util';
import { Location } from '@angular/common';
import { OficioModel } from '../../../models/oficio.model';
import { ObservacionService } from '../../../../@suficiencias/pages/services/observacion.service.';
import { ObservacionModel } from '../../../../@suficiencias/pages/models/observacion.model';
import { ToastService } from '../../../../@common/services/toast-service';
import { Router, ActivatedRoute } from '@angular/router';
import { OficioService } from '../../../services/oficio.service';
import { ResponsableRequerimientoModel } from '../../../models/requerimiento-asignado.model';
import { RequerimientoAsignadoService } from '../../../services/requerimientoAsignado.service';



@Component({
  selector: 'app-oficio-form_',
  templateUrl: './requerimientos-form.component.html',
  styleUrls: ['./requerimientos-form.component.scss']
})
export class RequerimientosFormComponent implements OnInit {


  public listUsuarios: Array<UsuarioModel> = [];
  public Req: RequerimientoModel;

  public tipoAdjunto: TipoAdjuntoModel;
  public listTiposAdjunto: Array<TipoAdjuntoModel> = [];
  public listAdjuntos: Array<AdjuntoModel> = [];
  public observacionInput: ObservacionModel;
  public listaObservaciones: Array<ObservacionModel> = [];
  public listaObs: Array<ObservacionModel> = [];
  public tipoSeleccionado: boolean = false;
  public archivo: File = null;
  public usuario: UsuarioModel;
  fecha_recepcion: NgbDate;
  fecha_asignacion: NgbDate;
  fecha_recepcionFront: NgbDate;
  fecha_asignacionFront: NgbDate;
  public requerimientoInput: RequerimientoModel;
  public accion;
  public oficioInput: OficioModel;
  public location: Location;
  public tittle: String;

  public modoVisualizar: boolean = false;
  public datosRequerimiento_1: boolean = false;
  public datosRequerimiento_2: boolean = false;
  public observacionRequerimiento: boolean = false;
  public observacionesRequerimiento: boolean = false;
  public adjuntosRequerimiento: boolean = false;
  public agregarAdjuntos: boolean = false;
  public agregarResponsable: boolean = false;
  public guardando: boolean = false;
  public estatus_requerimiento_aux: number;
  public responsables: boolean = false;

  public listaResponsables: Array<ResponsableRequerimientoModel> = [];
  public responsable: ResponsableRequerimientoModel;
  public responsableInput: ResponsableRequerimientoModel;
  modal: NgbModalRef;
  //@Output() requerimientoOutput: EventEmitter<any> = new EventEmitter();
  //@Output() accionOutput: EventEmitter<any> = new EventEmitter();

  activeModal: NgbActiveModal

  constructor(
    private servicioUsuarios: UsuarioService,
    private servicioRequerimiento: RequerimientoService,
    private servicioObservaciones: ObservacionService,
    private servicioAdjuntos: AdjuntoService,
    private servicioOficios: OficioService,
    private servicioTiposAdjunto: TipoAdjuntoService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private modDialog: NgbModal,
    location: Location,
    private servicioReqAsignacion: RequerimientoAsignadoService,
  ) {
    this.location = location;
    let accion_form = this.route.snapshot.routeConfig.path;

    accion_form === "agregarRequerimiento" ? (this.accion = "Agregar") : (this.accion = "Editar");
    this.tittle = this.accion;
    this.requerimientoInput = new RequerimientoModel();
    this.oficioInput = new OficioModel();
    this.responsableInput = new ResponsableRequerimientoModel();
    this.tipoAdjunto = new TipoAdjuntoModel();
    this.observacionInput = new ObservacionModel();
    const today = new Date();
    this.fecha_recepcionFront = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.fecha_asignacionFront = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    this.usuario = JSON.parse(localStorage.getItem('usuario'));


  }

  async ngOnInit() {

    this.listUsuarios = await this.consultarUsuarios();

    this.listTiposAdjunto = await this.consultarTiposAdjunto();

    let requerimiento = this.route.snapshot.params;

    let listoficio = await this.consultarOficio(requerimiento.id_oficio);
    this.oficioInput = listoficio[0];
    this.requerimientoInput.id_oficio = this.oficioInput.id_oficio;
    this.requerimientoInput.id_requerimiento = 0;

    if (this.accion === 'Editar') {

      let listReq = await this.consultarRequerimiento(Number(requerimiento.id_requerimiento));
      this.requerimientoInput = listReq[0];

      //Inicializar fechas
      this.fecha_recepcionFront = this.obtenerFecha(this.requerimientoInput.fecha_recepcion);
      //this.fecha_asignacionFront = this.obtenerFecha(this.requerimientoInput.fecha_asignacion);
      await this.consultarAdjuntos();
      this.listaObservaciones = new Array<ObservacionModel>();
      await this.consultarObservaciones();
      await this.consultarResponsables();

    }

    this.consultarOpciones();
  }

  public consultarOpciones() {
    //VALIDACIONES PARA MOSTRAR ELEMENTOS EN FRONT

    if (this.usuario.id_rol == 8) {
      if (this.requerimientoInput.id_requerimiento == 0) {
        // cargaria el campo fechas recepcion deshabilitado y campo requerimiento habilitado
        //cargaria adjuntos
        this.datosRequerimiento_1 = true;
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;

      }
      else if (this.requerimientoInput.id_estatus == 2) {
        this.datosRequerimiento_1 = true;
        this.adjuntosRequerimiento = true;
      }
      else {
        //Modo visualizar
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.modoVisualizar = true;

        if (this.listaResponsables.length > 0) {
          this.responsables = true;
        }
      }


    }
    else if (this.usuario.id_rol == 9) {
      if (this.requerimientoInput.id_estatus == 12) {
        //cargaria el campo de asignado a
        // las fechas y campo requerimiento desahabilitados
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.adjuntosRequerimiento = true;
        this.agregarResponsable = true;
        this.responsables = true;

      } else if (this.requerimientoInput.id_estatus == 14 || this.requerimientoInput.id_estatus == 17) {
        // cargaria el campo de asignado, las fechas y campo requerimiento desahabilitados
        //cargaria el campo de observaciones
        //cargaria adjuntos
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.modoVisualizar = true;
        this.observacionRequerimiento = true;
        this.observacionesRequerimiento = true;
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;
        this.responsables = true;


      } else {
        //Modo visualizar
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.modoVisualizar = true;
        if (this.listaResponsables.length > 0) {
          this.responsables = true;
        }
      }
    }
    else if (this.usuario.id_rol == 10) {
      if (this.requerimientoInput.id_estatus == 13 || this.requerimientoInput.id_estatus == 16) {
        //tendria acceso a observaciones y adjuntos
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.modoVisualizar = true;
        this.observacionRequerimiento = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;
        this.responsables = true;

      } else {
        //Modo visualizar
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.modoVisualizar = true;
        if (this.listaResponsables.length > 0) {
          this.responsables = true;
        }
      }
    }
    else if (this.usuario.id_rol == 11) {
      if (this.requerimientoInput.id_requerimiento == 0) {
        // cargaria el campo fechas recepcion deshabilitado y campo requerimiento habilitado
        //cargaria adjuntos
        this.datosRequerimiento_1 = true;
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;

      }
      else if (this.requerimientoInput.id_estatus == 2) {
        this.datosRequerimiento_1 = true;
        this.adjuntosRequerimiento = true;
      }
      else if (this.requerimientoInput.id_estatus == 12) {
        //cargaria el campo de asignado a
        // las fechas y campo requerimiento desahabilitados
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.adjuntosRequerimiento = true;
        this.agregarResponsable = true;
        this.responsables = true;

      } else if (this.requerimientoInput.id_estatus == 14 || this.requerimientoInput.id_estatus == 17) {
        // cargaria el campo de asignado, las fechas y campo requerimiento desahabilitados
        //cargaria el campo de observaciones
        //cargaria adjuntos
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.modoVisualizar = true;
        this.observacionRequerimiento = true;
        this.observacionesRequerimiento = true;
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;
        this.responsables = true;
      }
      else if (this.requerimientoInput.id_estatus == 13 || this.requerimientoInput.id_estatus == 16) {
        //tendria acceso a observaciones y adjuntos
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.modoVisualizar = true;
        this.observacionRequerimiento = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.agregarAdjuntos = true;
        this.responsables = true;
      }
      else {
        //Modo visualizar
        this.datosRequerimiento_1 = true;
        this.datosRequerimiento_2 = true;
        this.observacionesRequerimiento = true
        this.adjuntosRequerimiento = true;
        this.modoVisualizar = true;
        if (this.listaResponsables.length > 0) {
          this.responsables = true;
        }
      }
    }
  //FIN VALIDACIONES PARA MOSTRAR ELEMENTOS EN FRONT

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
    const respuesta: any = await this.servicioUsuarios.consultar('?id_rol=10');
    return respuesta;
  }

  public async consultarTiposAdjunto() {
    const respuesta: any = await this.servicioTiposAdjunto.consultar();
    return respuesta;
  }

  public async consultarAdjuntos() {

    const respuesta: any = await this.servicioAdjuntos.consultar('?id_requerimiento_auditoria=' + this.requerimientoInput.id_requerimiento);
    if (respuesta != null)
      return this.listAdjuntos = respuesta;
  }

  consultar_usuarioAsignado(idUsuario: number): UsuarioModel {
    let usuario_ = this.listUsuarios.filter(usuario_ =>
      usuario_.id_usuario === idUsuario
    )[0];
    return usuario_;
  }

  public async consultarOficio(id_oficio: number) {
    const respuesta: any = await this.servicioOficios.consultar('?id_oficio=' + id_oficio);
    return respuesta;
  }

  public async consultarObservaciones() {
    const respuesta: any = await this.servicioObservaciones.consultarAsync('observaciones/consultar?id_requerimiento=' + this.requerimientoInput.id_requerimiento);
    if (respuesta != null)
      return this.listaObservaciones = respuesta;
  }

  public async consultarRequerimiento(id_requerimiento: number) {
    const respuesta: any = await this.servicioRequerimiento.consultar('?id_requerimiento=' + id_requerimiento);
    return respuesta;
  }


  async generarAtenderObservaciones(form: NgForm) {
    this.guardando = true;
    let requerimiento_model = this.requerimientoInput as RequerimientoModel;


    if (form.valid) {
      let id_aux: number = requerimiento_model.id_estatus;

      requerimiento_model.id_usuario_requerimiento = this.usuario.id_usuario;

      if (requerimiento_model.id_estatus === 14 || requerimiento_model.id_estatus === 17) {
        requerimiento_model.id_estatus = 16;
      } else if (requerimiento_model.id_estatus === 16) {
        requerimiento_model.id_estatus = 17;
      }

      this.observacionInput.id_requerimiento = requerimiento_model.id_requerimiento;
      this.listaObs.push(this.observacionInput);
      requerimiento_model.observaciones = JSON.stringify(this.listaObs);

      const respuestaM = await this.servicioRequerimiento.modificar(requerimiento_model);
      if (Number(respuestaM) > 0) {

        let lista_adjuntos_nuevos: Array<AdjuntoModel>; // Solo adjuntos nuevos.
        lista_adjuntos_nuevos = this.listAdjuntos.filter(x => x.id_adjunto == null);


        if (lista_adjuntos_nuevos.length > 0) {
          this.guardarAdjuntos();
        } else {
          //this.requerimientoOutput.emit(requerimiento_model);
          //this.accionOutput.emit(this.accion);
          this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
          this.redireccionOficio();

        }

      } else {
        requerimiento_model.id_estatus = id_aux;
        this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
      }

    } else {
      this.toastService.show('Formulario incompleto ', { classname: 'bg-danger  text-light', delay: 3000 });
    }
  }


  redireccionOficio() {
    let oficio = new OficioModel();
    oficio.id_oficio = this.requerimientoInput.id_oficio;
    this.router.navigate(['/finanzas/auditorias/dashboard/editarOficio', oficio]);
  }

  async agregarRequerimiento(form: NgForm) {
    debugger
    this.guardando = true;
    let requerimiento_model = this.requerimientoInput as RequerimientoModel;


    requerimiento_model.fecha_recepcion = this.fecha_recepcionFront['year'] + '-' +
      (this.fecha_recepcionFront['month'] <= 9 ? '0' + this.fecha_recepcionFront['month'] : this.fecha_recepcionFront['month']) + '-' +
      (this.fecha_recepcionFront['day'] <= 9 ? '0' + this.fecha_recepcionFront['day'] : this.fecha_recepcionFront['day']);

   /*  requerimiento_model.fecha_asignacion = this.fecha_asignacionFront['year'] + '-' +
      (this.fecha_asignacionFront['month'] <= 9 ? '0' + this.fecha_asignacionFront['month'] : this.fecha_asignacionFront['month']) + '-' +
      (this.fecha_asignacionFront['day'] <= 9 ? '0' + this.fecha_asignacionFront['day'] : this.fecha_asignacionFront['day']); */

    requerimiento_model.id_usuario_requerimiento = this.usuario.id_usuario;

    let respuesta: string;
    if (this.accion === 'Editar' && requerimiento_model.id_requerimiento > 0) {

      if (requerimiento_model.id_estatus === 12 && Number(this.oficioInput.id_estatus) === 12) {

        /* let datosUsuario = this.consultar_usuarioAsignado(requerimiento_model.id_asignado);
        requerimiento_model.nombre_asignado = datosUsuario.nombre + ' ' + datosUsuario.apellido_paterno + ' ' + datosUsuario.apellido_materno;
        //requerimiento_model.id_asignado['nombre'] + ' ' + requerimiento_model.id_asignado['apellido_paterno'] + ' ' + requerimiento_model.id_asignado['apellido_materno'];
        requerimiento_model.id_asignado = datosUsuario.id_usuario; */
        requerimiento_model.lista_asignados = JSON.stringify(this.listaResponsables);
        requerimiento_model.id_estatus = 13;
        this.estatus_requerimiento_aux = 12;
        this.asignarRequerimiento();

      } else if (requerimiento_model.id_estatus === 13) {
        this.estatus_requerimiento_aux = 13;
        requerimiento_model.id_estatus = 14;
        this.observacionInput.id_requerimiento = requerimiento_model.id_requerimiento;
        this.listaObs.push(this.observacionInput);
        requerimiento_model.observaciones = JSON.stringify(this.listaObs);

        const respuestaM = await this.servicioRequerimiento.modificar(requerimiento_model);
        if (Number(respuestaM) > 0) {
          this.guardarAdjuntos();
        } else {
          this.guardando = false;
          console.log(respuestaM);
          this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
        }
      } else if (requerimiento_model.id_estatus === 14 || requerimiento_model.id_estatus === 17) {
        this.estatus_requerimiento_aux = 14;
        requerimiento_model.id_estatus = 15;
        this.observacionInput.id_requerimiento = requerimiento_model.id_requerimiento;
        this.listaObs.push(this.observacionInput);
        requerimiento_model.observaciones = JSON.stringify(this.listaObs);

        const respuestaM = await this.servicioRequerimiento.modificar(requerimiento_model);
        if (Number(respuestaM) > 0) {
          this.guardarAdjuntos();
        } else {
          this.guardando = false;
          console.log(respuestaM);
          this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });

        }
      } else if (requerimiento_model.id_estatus === 2 && Number(this.oficioInput.id_estatus) === 2) {
        const respuestaM = await this.servicioRequerimiento.modificar(requerimiento_model);
        if (Number(respuestaM) > 0) {
          //this.requerimientoOutput.emit(requerimiento_model);
          //this.accionOutput.emit(this.accion);
          this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
          this.redireccionOficio();
        } else {
          this.guardando = false;
          console.log(respuestaM);
          this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });

        }
      }


    } //AGREGAR
    else {
      requerimiento_model.id_requerimiento = 0;
      requerimiento_model.id_estatus = 2;
      requerimiento_model.nombre_estatus = 'REGISTRADA';

      respuesta = await this.servicioRequerimiento.agregar(requerimiento_model);
      if (respuesta) {
        if (Number(respuesta) > 0) {

          requerimiento_model.id_requerimiento = Number(respuesta);
          this.guardarAdjuntos();

        } else {
          this.guardando = false;
          this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
          console.log(respuesta);
        }
      }
    }
  }
  async asignarRequerimiento() {

    const respuesta = await this.servicioRequerimiento.modificar(this.requerimientoInput);
    if (respuesta) {
      if (Number(respuesta) > 0) {
        //this.requerimientoOutput.emit(this.requerimientoInput);
        //this.accionOutput.emit(this.accion);
        this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
        this.redireccionOficio();
      } else {
        this.requerimientoInput.id_estatus = this.estatus_requerimiento_aux; // Regresa el estatus hasta antes de solicitar la actualizacion
        console.log(respuesta);
        this.guardando = false;
        this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });

      }
    }
  }

  async guardarObservacion(form: NgForm) {
    if (form.valid) {
      debugger
      let observacion: ObservacionModel = new ObservacionModel();
      observacion.id_requerimiento = this.requerimientoInput.id_requerimiento;
      observacion.observacion = this.observacionInput.observacion
      const respuesta = await this.servicioObservaciones.guardarAsync('observaciones/Agregar', observacion);

      if (Number(respuesta.respuesta) > 0) {
        this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
        this.redireccionOficio();
      } else {
        this.guardando = false;
        this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });

      }

    } else {
      this.toastService.show('Formulario incompleto ', { classname: 'bg-danger  text-light', delay: 3000 });
    }
  }

  async guardarAdjuntos() {

    let errorAdjunto: boolean = false;


    let lista_adjuntos_nuevos: Array<AdjuntoModel>; // Solo adjuntos nuevos.
    lista_adjuntos_nuevos = this.listAdjuntos.filter(x => x.id_adjunto == null);

    for (let i = 0; i < lista_adjuntos_nuevos.length; i++) {
      lista_adjuntos_nuevos[i].id_requerimiento_auditoria = this.requerimientoInput.id_requerimiento;
    }

    const respuestaAdjuntos: Array<string> = await this.servicioAdjuntos.agregarList(lista_adjuntos_nuevos);

    for (let i = 0; i < respuestaAdjuntos.length; i++) {
      if (respuestaAdjuntos[i] != "1") {
        errorAdjunto = true;
      }
    }

    if (!errorAdjunto) {
      //this.requerimientoOutput.emit(this.requerimientoInput);
      //this.accionOutput.emit(this.accion);
      this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
      this.redireccionOficio();
    } else {
      this.requerimientoInput.id_estatus = this.estatus_requerimiento_aux; // Regresa el estatus hasta antes de solicitar el guardado
      console.log(respuestaAdjuntos);
      this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
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
    var stringBase64;

    this.archivo = archivo.item(0);
    if (this.archivo != null) {
      stringBase64 = await this.toBase64(this.archivo) as string;
    }

    this.listAdjuntos.push({
      //id_adjunto: null,
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
  });

  validarFormulario(form: NgForm) {
    if (form.valid && this.listAdjuntos.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  validarFormularioAdObs(form: NgForm) {
    let lista_adjuntos_nuevos: Array<AdjuntoModel>; // Solo adjuntos nuevos.
    lista_adjuntos_nuevos = this.listAdjuntos.filter(x => x.id_adjunto == null);

    if (form.valid && lista_adjuntos_nuevos.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  eliminarAdjunto(adjunto: AdjuntoModel) {
    const index = this.listAdjuntos.indexOf(adjunto);
    this.listAdjuntos.splice(index, 1);
  }

  public abrirModal(content: any, responsableM: ResponsableRequerimientoModel) {

    if (responsableM !== null ) {
      this.responsable = responsableM;
      this.responsableInput.id_asignado = responsableM.id_asignado;
    } else {
      this.responsable = new ResponsableRequerimientoModel();
    }

    this.modal = this.modDialog.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    this.modal.result.then(async (result) => {
      if (result === null) {
        this.modal.dismiss();
      } else {

        const today = new Date();
        const fechaF = today.getFullYear() + '-'
                      + ((today.getMonth() + 1) <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-'
                      + (today.getDate() <= 9 ? '0' + today.getDate()
                      : today.getDate()) + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

        const validar = this.validarResponsable(this.responsableInput.id_asignado);
        const datosUsuario = this.buscarUsuario(this.responsableInput.id_asignado);

        if (validar === null) {
          this.listaResponsables.push({
            id_requerimiento_asignado: null,
            id_requerimiento: this.requerimientoInput.id_requerimiento,
            id_asignado: datosUsuario.id_usuario,
            nombre_asignado: `${datosUsuario.nombre} ${datosUsuario.apellido_paterno} ${datosUsuario.apellido_materno}`,
            fecha_asignacion: fechaF
          });
        } else {
          this.toastService.show(`El usuario ${datosUsuario.nombre} ya fue asignado`, { classname: 'bg-danger  text-light', delay: 3000 });
        }
      }

    });
  }


  public async consultarResponsables() {
    // tslint:disable-next-line: max-line-length
    let listaAux: Array<ResponsableRequerimientoModel> = [];
    const respuesta: any = await this.servicioReqAsignacion.consultar(`?id_requerimiento=${this.requerimientoInput.id_requerimiento}`);
    if (respuesta !== null) {
      listaAux = respuesta;
      listaAux.forEach(resp => {
        const usuarioDatos = this.buscarUsuario(resp.id_asignado);
        resp.nombre_asignado = `${ usuarioDatos.nombre } ${ usuarioDatos.apellido_paterno } ${ usuarioDatos.apellido_materno }`;
      });
      console.log(listaAux);
      return this.listaResponsables = listaAux;
    }
  }

  buscarUsuario(id_usuario: number) {
    return this.listUsuarios.find( usuario => usuario.id_usuario === id_usuario);
  }

  validarResponsable(id_usuario: number) {
    let validar: any;
    if (this.listaResponsables.length > 0) {
      validar = this.listaResponsables.find( resp => resp.id_asignado === id_usuario);
      if (validar === undefined) {
        validar = null;
      }
    } else {
      validar = null;
    }
    return validar;
  }

  eliminarResp(posicion: number) {
    this.listaResponsables.splice(posicion, 1);
  }

  public async cancelarAsignacion(responsableF: ResponsableRequerimientoModel) {

    responsableF.accion = 4;
    responsableF.id_asignado = this.usuario.id_usuario;
    console.log(responsableF);
    const respuesta = await this.servicioReqAsignacion.modificar(responsableF);
    if (respuesta) {
      if (Number(respuesta) > 0) {
        await this.consultarResponsables();
        this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
      } else {
        this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
      }
    }
  }
  public async reasignar(form: NgForm) {

    const usuarioDatos = this.buscarUsuario(this.responsableInput.id_asignado);

    const validar = this.validarResponsable(this.responsableInput.id_asignado);

    // tslint:disable-next-line: max-line-length
    this.responsableInput.nombre_asignado = `${ usuarioDatos.nombre } ${ usuarioDatos.apellido_paterno } ${ usuarioDatos.apellido_materno }`;

    if (validar === null) {
      this.responsableInput.id_requerimiento = this.requerimientoInput.id_requerimiento;
      this.responsableInput.id_requerimiento_asignado = this.responsable.id_requerimiento_asignado;
      this.responsableInput.accion = 1;
      this.responsableInput.id_asignado = usuarioDatos.id_usuario;
      console.log(this.responsableInput);
      const respuesta = await this.servicioReqAsignacion.modificar(this.responsableInput);

      if (Number(respuesta) > 0) {
        await this.consultarResponsables();
        this.cerrarModal();
        this.toastService.show('La información se guardado correctamente ', { classname: 'bg-success text-light', delay: 3000 });
      } else {
        this.cerrarModal();
        this.toastService.show('Ocurrio un error ', { classname: 'bg-danger  text-light', delay: 3000 });
      }
    } else {
      this.cerrarModal();
      // tslint:disable-next-line: max-line-length
      this.toastService.show(`El usuario ${this.responsableInput.nombre_asignado} ya fue asignado`, { classname: 'bg-danger  text-light', delay: 3000 });
    }
  }
  cerrarModal() {
    this.modal.close(null);
  }
  /* Valida cuando ya puede cerrar el proceso de asignación */
  validarCierreAsigncion() {
    let result = true;
    if (this.listaResponsables.length > 0) {
      this.listaResponsables.forEach(resp => {
        if (resp.aceptado !== true) {
          result = false;
        }
      });
      return result;
    } else {
      return false;
    }
  }
}
