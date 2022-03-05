import {Injectable} from '@angular/core';

@Injectable()
export class ThemeConstants {

  private colorConfig: any;
  dtOptions: DataTables.Settings = {};

  constructor() {

    this.colorConfig = {
      colors: {
        primary: '#7774e7',
        info: '#0f9aee',
        success: '#37c936',
        warning: '#ffcc00',
        danger: '#ff3c7e',
        primaryInverse: 'rgba(119, 116, 231, 0.1)',
        infoInverse: 'rgba(15, 154, 238, 0.1)',
        successInverse: 'rgba(55, 201, 54, 0.1)',
        warningInverse: 'rgba(255, 204, 0, 0.1)',
        dangerInverse: 'rgba(255, 60, 126, 0.1)',
        gray: '#ebeef6',
        white: '#ffffff',
        dark: '#515365',
      }
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        processing: 'Procesando...',
        lengthMenu: 'Mostrar _MENU_ registros',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'Ningún dato disponible',
        info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
        infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
        infoFiltered: '(filtrado de un total de _MAX_ registros)',
        infoPostFix: '',
        search: 'Buscar:',
        url: '',
        thousands: ',',
        loadingRecords: 'Cargando...',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior'
        },
        aria: {
          sortAscending: ': Activar para ordenar la columna de manera ascendente',
          sortDescending: ': Activar para ordenar la columna de manera descendente'
        },
      },
      lengthChange: false
    };
  }

  get() {
    return this.colorConfig;
  }
}
