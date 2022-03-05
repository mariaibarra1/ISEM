import {
  Component,
  Input,
  OnInit,
  ɵConsole,
  ɵCompiler_compileModuleSync__POST_R3__,
} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { SufienciaService } from '../../services/suficiencia.service';
import { RemitenteService } from '../../services/remitente.service';
import { RecursoService } from '../../services/recurso.service';
import { SuficienciaModel } from '../../models/suficiencia.model';
import { RemitenteModel } from '../../models/remitente.model';
import { RecursoModel, Fuentefinanciamiento } from '../../models/recurso.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, JsonPipe } from '@angular/common';
import {
  NgbDate,
  NgbModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { AdjuntoModel } from 'src/app/@finanzas/@auditorias/models/adjunto.model';
import { ObservacionModel, Observacio } from '../../models/observacion.model';
import { ObservacionService } from '../../services/observacion.service.';
import { PartidaService } from '../../services/partida.service';
import { PartidaModel, PartidaFF } from '../../models/partida.model';
import { AdjuntoService } from 'src/app/@finanzas/@auditorias/services/adjunto.service';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { ToastService } from '../../../../@common/services/toast-service';
import { monthsShort } from 'moment';
import { UsuarioModel } from 'src/app/@finanzas/@auditorias/models/usuario.model';
import { UsuarioService } from 'src/app/@finanzas/@auditorias/services/usuario.service';
import {
  TipoOficioModel,
  FirmantesOficio,
} from '../../models/tipo-oficio.model';
import { TipoOficioService } from '../../services/tipo-oficio.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CaTipoSuficienciaModel } from '../../models/CaTipoSuficiencia.model';
import { ParametroModel } from '../../models/parametro.model';
import { TipoSuficienciaService } from '../../services/tipo-suficiencia.service';
import { ParametroService } from '../../services/parametro.service';
import { environment } from '../../../../../../environments/environment';
import { OficioService } from '../../../../@auditorias/services/oficio.service';

@Component({
  selector: 'app-suficiencia-form',
  templateUrl: './suficiencia-form.component.html',
  styleUrls: ['./suficiencia-form.component.scss'],
})
export class SuficienciaFormComponent implements OnInit {
  public suficiencia = new SuficienciaModel();
  public observacion = new ObservacionModel();
  public partidaFF = new PartidaFF();
  public firmantes = new FirmantesOficio();

  public obj: number;
  public montomodificado = false;
  public tittle: string;
  public listRemitente: Array<RemitenteModel> = [];
  public listEstatus: Array<any> = [];
  public archivo: File = null;
  public listRecursos: Array<RecursoModel> = [];
  public listRecursosXPartida: Array<PartidaModel> = [];
  public listSuficiencia: Array<SuficienciaModel> = [];
  public listPartidas: Array<PartidaModel> = [];
  public listAdjuntos: Array<AdjuntoModel> = [];
  public listObservaciones: Array<ObservacionModel> = [];
  public listObs: Array<Observacio> = [];
  public listFuentes: Array<Fuentefinanciamiento> = [];
  public listUsuarios: Array<UsuarioModel> = [];
  public listUsuariosPresupuestos: Array<UsuarioModel> = [];
  public listFF: Array<PartidaFF> = [];
  public listTiposOficio: Array<TipoOficioModel> = [];
  public listCaTipoSuficiencia: Array<CaTipoSuficienciaModel> = [];
  public listparametro: Array<ParametroModel> = [];
  public conceptoPartida: string;
  public montoMaximo: number;
  location: Location;
  public status: number;
  public montoEroor = false;
  public cheque = false;
  public usuario;

  public turnar = false;
  formato = 'pdf';
  private reportSubscription: Subscription;

  constructor(
    location: Location,
    private servicioRecursos: RecursoService,
    private servicioRemitentes: RemitenteService,
    private servicioSuficiencia: SufienciaService,
    private servicioAdjuntos: AdjuntoService,
    private servicioObservacion: ObservacionService,
    private serviopartida: PartidaService,
    private servicioUsuario: UsuarioService,
    private servicioTipoOficio: TipoOficioService,
    private servicioCaTiposuficiencia: TipoSuficienciaService,
    private serviceparametro: ParametroService,
    private _route: ActivatedRoute,
    private _matDialog: NgbModal,
    private router: Router,
    public toastService: ToastService,
    private httpClient: HttpClient
  ) {
    this.obj = +this._route.snapshot.paramMap.get('id');
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    if (this.obj !== 0) {
      this.tittle = 'Visualizar';
    } else {
      this.tittle = 'Agregar';
      this.status = 2;
      const today = new Date();
      this.suficiencia.fecha_recepcionfront = new NgbDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
    }
    this.location = location;
  }

  async ngOnInit() {
    this.listRemitente = await this.consultarRemintentes();
    const partidas = await this.consultarPartida();
    this.listCaTipoSuficiencia = await this.consultarCaTipoSuficiencia();
    this.listparametro = await this.consultarParametros();

    await this.consultarUsuarios();
    if (partidas) {
      this.listPartidas = partidas.filter((a) => a.monto_max_real != null);
    } else {
      this.listPartidas = [];
    }
    this.listRecursos = await this.consultarRecurso();

    if (this.obj !== 0) {
      this.ConsultarcFiltroSuficiencias();
    }
  }
  public async consultarrecursos() {
    const respuesta: any = await this.servicioRemitentes.consultarAsync(
      'catalogos/CaFuenteFinanciamiento/consultar'
    );
    // tslint:disable-next-line: triple-equals
    if (respuesta == null || respuesta.success == false) {
      return;
    }
    return respuesta;
  }

  public async consultarRemintentes() {
    const respuesta: any = await this.servicioRemitentes.consultarAsync(
      'catalogos/caarea/consultar'
    );
    // tslint:disable-next-line: triple-equals
    if (respuesta == null || respuesta.success == false) {
      return;
    }
    return respuesta;
  }

  public async consultarPartida() {
    const respuesta: any = await this.serviopartida.consultarAsync(
      'catalogos/capartida/consultar'
    );
    // tslint:disable-next-line: triple-equals
    if (respuesta == null || respuesta.success == false) {
      return;
    }
    return respuesta;
  }

  public async consultarRecurso() {
    const respuesta: any = await this.servicioRecursos.consultarAsync(
      'catalogos/CaFuenteFinanciamiento/consultar'
    );

    if (respuesta == null || respuesta.success === false) {
      return;
    }
    return respuesta;
  }

  public async consultarCaTipoSuficiencia() {
    const respuesta: any = await this.servicioCaTiposuficiencia.consultarAsync(
      'catalogos/CaTipoSuficiencia/Consultar'
    );
    // tslint:disable-next-line: triple-equals
    if (respuesta == null || respuesta.success == false) {
      return;
    }
    return respuesta;
  }

  public async consultarObservacaiones() {
    // tslint:disable-next-line: max-line-length
    const respuesta: any = await this.servicioObservacion.consultarAsync(
      'observaciones/consultar?id_suficiencia=' +
        this.suficiencia.id_suficiencia
    );
    if (respuesta != null) {
      return respuesta;
    } else {
      return 0;
    }
  }

  public async consultarAdjuntos() {
    const respuesta: any = await this.servicioAdjuntos.consultar(
      '?id_suficiencia=' + this.suficiencia.id_suficiencia
    );
    if (respuesta != null) {
      return (this.listAdjuntos = respuesta);
    }
  }

  public async consultarUsuarios() {
    const respuesta: any = await this.servicioUsuario.consultar('');
    if (respuesta != null) {
      return (this.listUsuarios = respuesta);
    }
  }

  public async consultarTiposOficio() {
    const respuesta: any = await this.servicioTipoOficio.consultar();
    if (respuesta != null) {
      return (this.listTiposOficio = respuesta);
    }
  }

  public async consultarParametros() {
    const respuesta: any = await this.serviceparametro.consultarAsync(
      'catalogos/parametro/Consultar'
    );

    // tslint:disable-next-line: triple-equals
    if (respuesta == null || respuesta.success == false) {
      return;
    }
    return respuesta;
  }

  public async ConsultarcFiltroSuficiencias() {
    const model = new SuficienciaModel();
    model.id_suficiencia = this.obj;
    const result = (await this.servicioSuficiencia.BusquedaAsync(
      'suficiencias/ConsultarxFiltro',
      model
    )) as SuficienciaModel;

    this.suficiencia = result[0];
    this.suficiencia.fecha_recepcionfront = new NgbDate(
      +this.suficiencia.fecha_recepcion.split('-')[2],
      +this.suficiencia.fecha_recepcion.split('-')[1],
      +this.suficiencia.fecha_recepcion.split('-')[0]
    );

    if (this.suficiencia.fecha_turno !== null) {
      this.suficiencia.fecha_turnadoFront = new NgbDate(
        +this.suficiencia.fecha_turno.split('-')[2],
        +this.suficiencia.fecha_turno.split('-')[1],
        +this.suficiencia.fecha_turno.split('-')[0]
      );
    }

    if (this.suficiencia.fecha_liberacion !== null) {
      this.suficiencia.fecha_liberacionfront = new NgbDate(
        +this.suficiencia.fecha_liberacion.split('-')[2],
        +this.suficiencia.fecha_liberacion.split('-')[1],
        +this.suficiencia.fecha_liberacion.split('-')[0]
      );
    }

    if (this.suficiencia.fecha_limite !== null) {
      this.suficiencia.fecha_Limitefront = new NgbDate(
        +this.suficiencia.fecha_limite.split('-')[2],
        +this.suficiencia.fecha_limite.split('-')[1],
        +this.suficiencia.fecha_limite.split('-')[0]
      );
    }

    this.status = this.suficiencia.id_estatus;
    const observa = await this.consultarObservacaiones();

    await this.consultarAdjuntos();
    await this.consultarUsuarios();
    await this.consultarTiposOficio();

    this.listUsuariosPresupuestos = this.listUsuarios.filter(
      (a) => a.id_rol == 3
    );
    if (this.suficiencia.fuentes_financiamiento !== null) {
      this.listFF = JSON.parse(
        this.suficiencia.fuentes_financiamiento
      ) as PartidaFF[];
    }

    if (observa !== 0) {
      if (observa && this.suficiencia.id_estatus === 2) {
        this.suficiencia.observacion = observa[0].observacion;
      } else {
        this.suficiencia.observacion = observa[0].observacion;
        const listob = observa as ObservacionModel[];
        this.listObservaciones = listob.filter(
          (a) => a.id_observacion !== observa[0].id_observacion
        );
      }
    }

    if (this.suficiencia.id_estatus === 8) {
      const today = new Date();
      this.suficiencia.fecha_liberacionfront = new NgbDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );

      today.setDate(today.getDate() + 45);
      this.suficiencia.fecha_Limitefront = new NgbDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );
    }
    if (this.suficiencia.id_estatus == 19) {
      this.suficiencia.id_usuario_estatus = null;
    }
    if (this.listparametro != null) {
      this.listparametro.forEach((a) => {
        if (a.monto <= this.suficiencia.monto_solicitado) {
          this.cheque = false;
        } else {
          this.cheque = true;
        }
      });
    }
  }

  public async guardarSuficiencia(form: NgForm) {
    const fechaRecepcion = this.suficiencia.fecha_recepcionfront;
    const model: SuficienciaModel = {
      id_area: form.controls.remitente.value,
      fecha_recepcion:
        fechaRecepcion.year +
        '-' +
        fechaRecepcion.month +
        '-' +
        fechaRecepcion.day,
      folio: form.controls.oficio.value,
      asunto: form.controls.asunto.value,
      monto_solicitado: form.controls.monto.value,
      id_estatus: 2,
      id_usuario: this.usuario.id_usuario,
    };

    if (this.listAdjuntos.length > 0) {
      model.id_estatus = 4;
      model.id_usuario = this.listUsuarios.filter(
        (a) => a.id_rol == 2
      )[0].id_usuario;
    }

    const obs = new Observacio();
    obs.id_suficiencia = 0;
    obs.observacion = form.controls.observaciones.value;
    this.listObservaciones.push(obs);

    model.observacion = JSON.stringify(this.listObservaciones);

    console.log(JSON.stringify(model));
    const data = await this.servicioSuficiencia.guardarAsync(
      'suficiencias/Agregar',
      model
    );

    if (data.status === 1) {
      this.guardarAdjuntos(+data.respuesta);

      this.toastService.show('Agregado Corrrectamente ', {
        classname: 'bg-success text-light',
        delay: 5000,
      });
      this.router.navigate(['/finanzas/suficiencias/dashboard']);
    } else {
      this.toastService.show('Error al agregar verifica los datos  ', {
        classname: 'bg-danger  text-light',
        delay: 5000,
      });
    }
  }

  public async TurnarSuficiencia(turnar?: boolean) {
    const model: SuficienciaModel = {
      id_suficiencia: this.suficiencia.id_suficiencia,
      id_estatus: this.suficiencia.id_estatus,
    };
    this.listObservaciones = this.listObservaciones.filter(
      (a) => a.id_observacion == null
    );

    switch (this.suficiencia.id_estatus) {
      case 2:
        if (this.listAdjuntos.length > 0) {
          model.id_estatus = 4;
          model.id_usuario = this.listUsuarios.filter(
            (a) => a.id_rol == 2
          )[0].id_usuario;
        }
        break;
      case 4:
        if (this.listObservaciones.length > 0) {
          model.id_estatus = 19;
          model.id_usuario = this.listUsuarios.filter(
            (a) => a.id_rol == 12
          )[0].id_usuario;
          model.id_tipo_suficiencia = this.suficiencia.id_tipo_suficiencia;
          model.id_tipo_suficiencia = this.suficiencia.id_tipo_suficiencia;
          model.observacion = JSON.stringify(this.listObservaciones);
        }

        break;
      case 5:
        if (this.listFF.length > 0 && this.listObservaciones.length > 0) {
          const fecha_turnado = this.suficiencia.fecha_turnadoFront;
          model.id_estatus = 20;
          model.id_usuario = model.id_usuario = this.listUsuarios.filter(
            (a) => a.id_rol == 12
          )[0].id_usuario;
          model.sp = this.suficiencia.sp;
          model.fecha_turno =
            fecha_turnado.year +
            '-' +
            fecha_turnado.month +
            '-' +
            fecha_turnado.day;
          model.fuentes_financiamiento = JSON.stringify(this.listFF);
          model.observacion = JSON.stringify(this.listObservaciones);
          model.monto_suficiencia = 0;
          this.listFF.forEach((a) => {
            model.monto_suficiencia += a.monto;
          });
          if (this.listparametro != null) {
            this.listparametro.forEach((a) => {
              if (a.monto >= this.suficiencia.monto_solicitado) {
                model.num_cheque = +this.suficiencia.num_cheque;
                model.monto_cheque = this.suficiencia.monto_cheque;
                model.banco_expedicion = this.suficiencia.banco_expedicion;
              }
            });
          }
        }

        break;
      case 6:
        model.id_estatus = 7;
        model.id_usuario = this.listUsuarios.filter(
          (a) => a.id_rol == 4
        )[0].id_usuario;
        model.observacion = JSON.stringify(this.listObservaciones);

        break;
      case 7:
        model.id_estatus = 22;
        model.id_usuario = this.listUsuarios.filter(
          (a) => a.id_rol == 12
        )[0].id_usuario;
        model.observacion = JSON.stringify(this.listObservaciones);

        break;
      case 8:
        const fechaliberacion = this.suficiencia.fecha_liberacionfront;
        const fechalimite = this.suficiencia.fecha_Limitefront;
        model.id_estatus = 9;
        model.fecha_liberacion =
          fechaliberacion.year +
          '-' +
          fechaliberacion.month +
          '-' +
          fechaliberacion.day;
        model.fecha_limite =
          fechalimite.year + '-' + fechalimite.month + '-' + fechalimite.day;
        model.id_usuario = this.listUsuarios.filter(
          (a) => a.id_rol == 2
        )[0].id_usuario;
        model.observacion = JSON.stringify(this.listObservaciones);

        break;
      case 9:
        model.id_estatus = 10;
        model.num_contrato = this.suficiencia.num_contrato;
        model.monto_adjudicado = this.suficiencia.monto_adjudicado;
        model.fuentes_financiamiento = JSON.stringify(this.listFF);
        model.id_usuario = this.listUsuarios.filter(
          (a) => a.id_rol == 5
        )[0].id_usuario;
        model.observacion = JSON.stringify(this.listObservaciones);
        model.monto_cheque = this.suficiencia.monto_cheque;
        model.banco_expedicion = this.suficiencia.banco_expedicion;
        model.num_cheque = this.suficiencia.num_cheque;
        break;

      case 10:
        model.id_estatus = 10;
        model.id_usuario = this.listUsuarios.filter(
          (a) => a.id_rol == 5
        )[0].id_usuario;
        model.observacion = JSON.stringify(this.listObservaciones);

        break;
      case 19:
        if (this.listObservaciones.length > 0) {
          model.id_usuario = this.suficiencia.id_usuario_estatus;
          model.id_estatus = 5;
          model.observacion = JSON.stringify(this.listObservaciones);
        }

        break;
      case 20:
        if (turnar) {
          if (this.listObservaciones.length > 0) {
            model.id_estatus = 6;
            model.id_usuario = this.listUsuarios.filter(
              (a) => a.id_rol == 2
            )[0].id_usuario;
            model.observacion = JSON.stringify(this.listObservaciones);
          }
          // si monto de la suficiencia es enos a 65  de aqui se debe brincar al estatus 9

          if (this.listparametro != null) {
            this.listparametro.forEach((a) => {
              if (a.monto >= this.suficiencia.monto_solicitado) {
                const today = new Date();
                this.suficiencia.fecha_liberacionfront = new NgbDate(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  today.getDate()
                );
                today.setDate(today.getDate() + 45);
                this.suficiencia.fecha_Limitefront = new NgbDate(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  today.getDate()
                );
                const fechaliberacion = this.suficiencia.fecha_liberacionfront;
                const fechalimite = this.suficiencia.fecha_Limitefront;
                model.fecha_liberacion =
                  fechaliberacion.year +
                  '-' +
                  fechaliberacion.month +
                  '-' +
                  fechaliberacion.day;
                model.fecha_limite =
                  fechalimite.year +
                  '-' +
                  fechalimite.month +
                  '-' +
                  fechalimite.day;
                model.id_estatus = 9;
                model.id_usuario = this.listUsuarios.filter(
                  (a) => a.id_rol == 2
                )[0].id_usuario;
              }
            });
          }
        } else {
          if (this.listObservaciones.length > 0) {
            model.id_usuario = this.suficiencia.asignacion_Presupuesto;
            model.id_estatus = 5;
            model.observacion = JSON.stringify(this.listObservaciones);
          }
        }
        break;
      case 22:
        if (this.listObservaciones.length > 0 && this.listAdjuntos.length > 0) {
          model.id_estatus = 8;
          model.id_usuario = this.listUsuarios.filter(
            (a) => a.id_rol == 2
          )[0].id_usuario;
          model.observacion = JSON.stringify(this.listObservaciones);
        }
        break;
    }

    console.log(JSON.stringify(model));

    if (model.id_estatus !== 11) {
      const data = await this.servicioSuficiencia.ModificarAsync(
        'suficiencias/modificar',
        model
      );

      if (data.status === 1) {
        this.guardarAdjuntos(+data.respuesta);

        this.toastService.show('Turnado Corrrectamente ', {
          classname: 'bg-success text-light',
          delay: 5000,
        });
        this.router.navigate(['/finanzas/suficiencias/dashboard']);
      } else {
        this.toastService.show('Error al agregar verifica los datos  ', {
          classname: 'bg-danger  text-light',
          delay: 5000,
        });
      }
    }
  }

  onClick() {
    const inputFile = document.getElementById('adjunto') as HTMLInputElement;
    inputFile.click();
  }

  async agregarAdjunto(archivo: FileList) {
    let stringBase64;

    this.archivo = archivo.item(0);
    if (this.archivo != null) {
      stringBase64 = (await this.toBase64(this.archivo)) as string;
    }

    this.listAdjuntos.push({
      nombre: this.archivo.name,
      tamanio: this.archivo.size.toString(),
      tipo: this.archivo.type,
      base64: stringBase64,
    });
  }

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async guardarAdjuntos(id_suficiencia: number) {
    for (let i = 0; i < this.listAdjuntos.length; i++) {
      this.listAdjuntos[i].id_suficiencia = id_suficiencia;
    }

    console.log(JSON.stringify(this.listAdjuntos));
    const respuesta: any = await this.servicioAdjuntos.agregarList(
      this.listAdjuntos
    );
    if (respuesta.exito === true) {
    }
  }

  eliminarAdjunto(adjunto: AdjuntoModel) {
    const index = this.listAdjuntos.indexOf(adjunto);
    this.listAdjuntos.splice(index, 1);
  }

  public agregarObservaciones(content: any) {
    this._matDialog
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        async (result) => {
          const today = new Date();
          const form = result as NgModel;
          const obser = new ObservacionModel();
          obser.id_suficiencia = this.suficiencia.id_suficiencia;

          obser.observacion = form.model;
          // tslint:disable-next-line: max-line-length
          obser.fecha_creacion =
            today.getFullYear() +
            '-' +
            (today.getMonth() + 1 <= 9
              ? '0' + (today.getMonth() + 1)
              : today.getMonth() + 1) +
            '-' +
            (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate()) +
            ' ' +
            today.getHours() +
            ':' +
            today.getMinutes() +
            ':' +
            today.getSeconds();

          // const obs = new Observacio();
          // obs.id_suficiencia = obser.id_suficiencia;
          // obs.observacion = obser.observacion;

          // this.listObs.push(obs);
          this.listObservaciones.push(obser);
          this.observacion = new ObservacionModel();
        },
        (reason) => {
          if (reason === ModalDismissReasons.ESC) {
            return (this.observacion = new ObservacionModel());
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return (this.observacion = new ObservacionModel());
          } else {
            return (this.observacion = new ObservacionModel());
          }
        }
      );
  }

  eliminarObservacion(obj: ObservacionModel) {
    const index = this.listObservaciones.indexOf(obj);
    // this.listObs.splice(index, 1);
    this.listObservaciones.splice(index, 1);
  }

  public agregarff(content: any) {
    this._matDialog
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        async (result) => {
          const form = result as NgForm;
          const part = new PartidaFF();

          const recurso = this.partidaFF
            .id_fuente_financiamiento as RecursoModel;
          const partida = (this.partidaFF
            .id_partida as unknown) as PartidaModel;

          part.id_suficiena = this.suficiencia.id_suficiencia;
          part.id_fuente_financiamiento = recurso.id_fuente_financiamiento;
          part.fuente_financiamiento = recurso.nombre;
          part.id_partida = partida.id_partida;
          part.concepto_partida = partida.concepto;
          part.monto = this.partidaFF.monto;
          part.descripcion = this.partidaFF.descripcion;

          const fuente = new Fuentefinanciamiento();
          fuente.id_fuente_financiamiento = part.id_fuente_financiamiento;
          fuente.id_partida = part.id_partida;
          fuente.id_suficiencia = part.id_suficiena;
          fuente.monto = part.monto;
          fuente.descripcion = part.descripcion;

          this.listPartidas.forEach((a) => {
            if (
              a.id_partida === partida.id_partida &&
              a.id_fuente_financiamiento === recurso.id_fuente_financiamiento
            ) {
              if (partida.partida !== 1000) {
                a.monto_modificado -= this.partidaFF.monto;
              }
            }
          });

          this.listFuentes.push(fuente);
          this.listFF.push(part);
          this.partidaFF = new PartidaFF();
          this.conceptoPartida = '';
          this.montoMaximo = 0;
          this.listRecursosXPartida = [];
          this.montoEroor = false;
        },
        (reason) => {
          if (reason === ModalDismissReasons.ESC) {
            this.partidaFF = new PartidaFF();
            this.conceptoPartida = '';
            this.montoMaximo = 0;
            this.listRecursosXPartida = [];
            this.montoEroor = false;
            return;
          } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            this.partidaFF = new PartidaFF();
            this.conceptoPartida = '';
            this.montoMaximo = 0;
            this.listRecursosXPartida = [];
            this.montoEroor = false;
            return;
          } else {
            this.partidaFF = new PartidaFF();
            this.conceptoPartida = '';
            this.montoMaximo = 0;
            this.listRecursosXPartida = [];
            this.montoEroor = false;
            return;
          }
        }
      );
  }

  eliminarFF(obj: PartidaFF) {
    const index = this.listFF.indexOf(obj);

    this.listFuentes.splice(index, 1);
    this.listFF.splice(index, 1);

    this.listPartidas.forEach((a) => {
      // tslint:disable-next-line:max-line-length
      if (
        a.id_partida === obj.id_partida &&
        a.id_fuente_financiamiento === obj.id_fuente_financiamiento
      ) {
        a.monto_modificado += obj.monto;
      }
    });
  }

  Valid(form: NgForm): boolean {
    const observaciones = this.listObservaciones.filter(
      (a) => a.id_observacion == null
    );
    const fuentes_financiamiento = this.listFF;
    const adjunto = this.listAdjuntos.filter((a) => a.id_adjunto == null);

    if (this.suficiencia.id_estatus === 2) {
      if (adjunto.length > 0 && !form.invalid) {
        return false;
      } else {
        return true;
      }
    } else if (this.suficiencia.id_estatus === 19) {
      if (this.listObservaciones) {
        if (observaciones.length > 0 && !form.invalid) {
          return false;
        } else {
          return true;
        }
      }
    } else if (this.suficiencia.id_estatus === 4) {
      if (this.listObservaciones && this.listAdjuntos) {
        if (observaciones.length > 0 && !form.invalid) {
          return false;
        } else {
          return true;
        }
      }
    } else if (this.suficiencia.id_estatus === 5) {
      if (fuentes_financiamiento !== null) {
        if (
          fuentes_financiamiento.length > 0 &&
          observaciones.length > 0 &&
          !form.invalid
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      if (this.listObservaciones && this.listAdjuntos) {
        if (observaciones.length > 0 && !form.invalid) {
          return false;
        } else {
          return true;
        }
      }
    }
    if (this.suficiencia.id_estatus === 10) {
      return true;
    } else {
      return false;
    }
  }

  partidaChenage(event: any) {
    this.conceptoPartida = event.concepto;
    this.montoMaximo = event.monto_modificado;
  }

  AgregarFecha() {
    const today = new Date();
    this.suficiencia.fecha_turnadoFront = new NgbDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
  }

  ValidarMontopartida() {
    const partida = (this.listRecursosXPartida = this.listPartidas.filter(
      (a) => a.id_partida === this.partidaFF.id_partida
    ));

    if (partida[0].partida !== 1000) {
      if (this.partidaFF.monto >= this.montoMaximo) {
        this.montoEroor = true;
      } else {
        this.montoEroor = false;
      }
    }
  }

  fuenteChange(event: any) {
    this.partidaFF.id_partida = null;
    this.conceptoPartida = '';
    this.montoMaximo = 0;
    this.listRecursosXPartida = this.listPartidas.filter(
      (a) => a.id_fuente_financiamiento === event.id_fuente_financiamiento
    );
  }

  validarMonto(obj: PartidaFF) {
    this.montomodificado = false;

    if (this.suficiencia.monto_adjudicado == null) {
      this.suficiencia.monto_adjudicado = 0;
    }
    if (!this.cheque) {
      if (obj.monto == obj.monto_adjudicado) {
        this.suficiencia.monto_adjudicado += obj.monto_adjudicado;
      } else if (obj.monto <= obj.monto_adjudicado) {
        const montofaltante = obj.monto_adjudicado - obj.monto;
        if (obj.monto_modificado >= montofaltante) {
          this.suficiencia.monto_adjudicado += montofaltante;
          obj.monto_modificado -= montofaltante;
          obj.monto = obj.monto_adjudicado;
          this.listFF[this.listFF.indexOf(obj)].monto_adjudicado =
            obj.monto_adjudicado;
        } else {
          this.montomodificado = true;
        }
      } else if (obj.monto >= obj.monto_adjudicado) {
        const montosobrantee = obj.monto - obj.monto_adjudicado;
        obj.monto_modificado += montosobrantee;
        obj.monto = obj.monto_adjudicado;
      }
    }
  }

  public abrirModal(content: any) {
    this._matDialog
      .open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' })
      .result.then(async (result) => {
        this.firmantes.id_suficiencia = this.suficiencia.id_suficiencia;
        await this.servicioSuficiencia.guardarFirmantes(this.firmantes);
        console.log(this.firmantes);
        this.generarOficio(this.firmantes.id_tipo_oficio);
      });
  }

  public generarOficio(tipoOficio: number) {
    let reporte;

    switch (tipoOficio) {
      case 1: {
        reporte = 'Suficiencia.' + this.formato;
        break;
      }

      case 2: {
        reporte = 'Ratificacion.' + this.formato;
        break;
      }

      case 3: {
        reporte = 'Fondo_Fijo.' + this.formato;
        break;
      }

      case 4: {
        reporte = 'Actualizacion_SP.' + this.formato;
        break;
      }

      case 5: {
        reporte = 'Vectores.' + this.formato;
        break;
      }
    }

    this.servicioTipoOficio
      .generarOficiosJasper(reporte, this.suficiencia.id_suficiencia)
      .subscribe(
        async (response) => {
          if (response.type.includes('pdf')) {
            this.downloadPDF(response);
          } else {
            this.downloadAny(response);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  private downloadPDF(file: Blob) {
    window.open(window.URL.createObjectURL(file));
  }

  private downloadAny(file: Blob) {
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(file);

    downloadLink.download = 'prueba.' + this.formato;

    document.body.appendChild(downloadLink);

    downloadLink.click();

    downloadLink.parentNode.removeChild(downloadLink);
  }
}
