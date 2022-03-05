import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  safeUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer
    ) {
   }

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://app.powerbi.com/view?r=eyJrIjoiNDU5ZTQyZjctNzY1MC00YzVlLWFmYzUtY2E0ZGNmN2Y5ZTA2IiwidCI6IjkyMWY3OWM5LWYzNzUtNDcwMS04YzAwLTI1NDFhYTQzMjFhNyJ9");
  }

}
