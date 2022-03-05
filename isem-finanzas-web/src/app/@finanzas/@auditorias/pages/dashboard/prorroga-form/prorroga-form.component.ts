import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { OficioModel } from '../../../models/oficio.model';
import { OficioService } from '../../../services/oficio.service';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../@common/services/toast-service';




@Component({
  selector: 'app-prorroga-form',
  templateUrl: './prorroga-form.component.html',
  styleUrls: ['./prorroga-form.component.scss']
})
export class ProrrogaFormComponent implements OnInit {

  @Input() public oficioInput: OficioModel;
  @Output() public prorrogaOutput: EventEmitter<any> = new EventEmitter();
  public usuario;

  activeModal: NgbActiveModal;
  fechaRecepcion: NgbDate;
  fechaCumplimiento: NgbDate;
  nuevFechaCumplimiento: NgbDate;

  constructor(
    private servicioOficios: OficioService,
    private toastService: ToastService
  ) {
    this.oficioInput = new OficioModel();
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
  }

  ngOnInit() {
    const today = new Date();
    //this.nuevFechaCumplimiento = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    this.fechaRecepcion = this.obtenerFecha(this.oficioInput.fecha_recepcion);
    this.fechaCumplimiento = this.obtenerFecha(this.oficioInput.fecha_cumplimiento);

    this.oficioInput.id_usuario_oficio = this.usuario.id_usuario;
  }

  public obtenerFecha(fecha: string): NgbDate {
    const stringFecha = fecha.split('-');
    const dia = stringFecha[2];
    const objFecha = {
      year: Number(stringFecha[0]),
      month: Number(stringFecha[1]),
      day: Number(dia.substring(0, 2))
    };
    const nuevaFecha: NgbDate = new NgbDate(objFecha.year, objFecha.month, objFecha.day);
    return nuevaFecha;
  }

  cerrarModal() {
    this.prorrogaOutput.emit('cerrar');
  }

  public async aplicarProrroga(form: NgForm) {
    if (form.valid) {
      const fechaRecepcion = this.fechaRecepcion;
      const fechaCumplimiento = this.nuevFechaCumplimiento;

      this.oficioInput.solicitar_prorroga = true;
      this.oficioInput.fecha_recepcion = fechaRecepcion.year + '-'
                                        + (fechaRecepcion.month <= 9 ? '0' + fechaRecepcion.month : fechaRecepcion.month) + '-'
                                        + (fechaRecepcion.day <= 9 ? '0' + fechaRecepcion.day : fechaRecepcion.day);
      this.oficioInput.fecha_cumplimiento = fechaCumplimiento.year + '-'
                                        + (fechaCumplimiento.month <= 9 ? '0' + fechaCumplimiento.month : fechaCumplimiento.month) + '-'
                                        + (fechaCumplimiento.day <= 9 ? '0' + fechaCumplimiento.day : fechaCumplimiento.day);
      this.oficioInput.id_estatus = Number(this.oficioInput.id_estatus);

      const respuesta = await this.servicioOficios.modificar(this.oficioInput);

      if (respuesta) {
        if (Number(respuesta) > 0) {
          this.toastService.show('La prórroga se aplicó correctamente ', { classname: 'bg-success text-light', delay: 3000 });
          this.oficioInput.id_oficio = Number(respuesta);
          this.prorrogaOutput.emit(this.nuevFechaCumplimiento);
        } else {
          console.log(respuesta);
          this.toastService.show('Ocurrió un error ', { classname: 'bg-danger  text-light', delay: 3000 });
          this.prorrogaOutput.emit('cerrar');
        }
      }
    }
  }

  validarFechas(): boolean {

    if ((this.nuevFechaCumplimiento != undefined) && (this.fechaCumplimiento != undefined)) {
      const fechaActual = new Date();
      const fechaCumplimiento = new Date(this.fechaCumplimiento.year + '/' + this.fechaCumplimiento.month + '/' + this.fechaCumplimiento.day);
      const nfechaCumplimiento = new Date(this.nuevFechaCumplimiento.year + '/' + this.nuevFechaCumplimiento.month + '/' + this.nuevFechaCumplimiento.day);

      
      if (fechaCumplimiento > nfechaCumplimiento) {
        return false;
      } else {
        if (nfechaCumplimiento > fechaCumplimiento) {
          return true;
        } else {
          false
        };
      }
    } else {
      return false;
    }
  }
}
