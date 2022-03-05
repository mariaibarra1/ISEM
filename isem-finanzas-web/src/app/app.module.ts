import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './@espire/shared/shared.module';
import { TemplateModule } from './@espire/template/template.module';
import { TemplateService } from './@espire/shared/services/template.service';

// Layout Component
import { CommonLayoutComponent } from './@espire/common/common-layout.component';
import { AuthenticationLayoutComponent } from './@espire/common/authentication-layout.component';

// Routing Module
import { AppRoutes } from './app.routing';

// App Component
import { AppComponent } from './app.component';
import { WebStorageService } from './@finanzas/@common/services/web-storage.service';
import { LocalStorageService } from './@finanzas/@common/services/local-storage.service';
import { MainService } from './@finanzas/@common/services/main.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './@finanzas/@common/utils/ngb-date-custom-parser-formatter';

import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

registerLocaleData(localeMx, 'es-MX', localeMxExtra);

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '$ ',
  suffix: '',
  thousands: ',',
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.NATURAL
};

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    SharedModule,
    TemplateModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)


  ],
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    AuthenticationLayoutComponent
  ],
  exports: [],
  providers: [
    TemplateService,
    {
      provide: NgbDateParserFormatter,
      useClass: NgbDateCustomParserFormatter
    },
    WebStorageService,
    LocalStorageService,
    MainService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {
}
