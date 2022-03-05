import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import 'd3';
import 'nvd3';
import {NvD3Module} from 'ng2-nvd3';
import {ChartsModule} from 'ng2-charts';
import {ThemeConstants} from '../../../../@espire/shared/config/theme-constant';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ChartsModule,
    NvD3Module,
    PerfectScrollbarModule
  ],
  providers: [
    ThemeConstants
  ]
})
export class HomeModule {
}
