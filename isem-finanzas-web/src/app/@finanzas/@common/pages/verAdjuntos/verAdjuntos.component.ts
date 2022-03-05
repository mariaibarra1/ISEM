
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { AdjuntoService } from '../../../@auditorias/services/adjunto.service';
import { AdjuntoModel } from '../../../@auditorias/models/adjunto.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verAdjuntos',
  templateUrl: './verAdjuntos.component.html',
  styleUrls: ['./verAdjuntos.component.css']
})
export class VerAdjuntosComponent implements OnInit {

  @Input() nombre_adjunto;
  @Output() doc = new EventEmitter();

  @ViewChild("modalAdjunto", {static: false}) modalAdjunto: TemplateRef<any>;

  public modalReference: any;

  constructor(
    private modalService: NgbModal,
    private servicioAdjuntos: AdjuntoService
  ) { }

  public pdfSrc: ArrayBuffer
  public imgSrc: string;
  public vidSrc: string;
  public typevid: string;
  public videoHTML: string;
  public videoplayer: HTMLVideoElement;  
  public listConsultar: AdjuntoModel[];
  public listResultado: AdjuntoModel[];

  ngOnInit() {

  }

  buscar() {
    const nombre = this.nombre_adjunto.split('.')[0]
    this.listConsultar = [{
      "nombre": nombre,
      "tipo": "",
      "tamanio": "",
      "base64": "",
      "id_adjunto": 0
    }];

    this.consultarAdjuntos();
  }

  async consultarAdjuntos() {
    this.listResultado = await this.servicioAdjuntos.verAdjunto(this.listConsultar);
    console.log(this.listResultado);
    this.verAdjunto(this.listResultado[0]);
  }

  verAdjunto(archivo: AdjuntoModel) {

    switch (archivo.tipo) {

      case "application/pdf": //pdf
        this.srcPdf(archivo);
        break;

      case "image/jpeg": //Imagen
        this.srcImagen(archivo);
        break;

        case "image/png": //Imagen
        this.srcImagen(archivo);
        break;
    }
  }

  srcPdf(archivo: AdjuntoModel){
    this.abrirModal();
    this.pdfSrc = this.base64ToArrayBuffer(archivo.base64);
  }
  
  base64ToArrayBuffer(base64: string) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
  }
  
  setHTMLVideo(archivo: AdjuntoModel) {
    this.videoHTML = "<video controls>" +
      "< source[type]=" + this.typevid + "[src] = " + this.vidSrc + " >" +
      "</video>";
  }

  //crea cadena src para pasarlo al control de video y cargarlo
  srcVideo(archivo: AdjuntoModel) {
    this.abrirModal();
    this.typevid = archivo.tipo;
    this.vidSrc = "data:" + archivo.tipo + ";base64," + archivo.base64 + "";
    //this.setHTMLVideo(archivo);
    let videoplay = <HTMLMediaElement>document.getElementById("videoplayer");
    videoplay.src = this.vidSrc;
    videoplay.load();
    videoplay.play();
    return this.vidSrc;
  }

  srcImagen(archivo: AdjuntoModel) {
    this.abrirModal();
    this.imgSrc = "data:" + archivo.tipo + ";base64," + archivo.base64 + "";
  }

  abrirModal(){
    this.modalReference =  this.modalService.open(this.modalAdjunto, { size: 'lg', backdrop: 'static', scrollable: true});
  }

  cerrarModal(){
    
    this.modalReference.close();
    
  }
}
