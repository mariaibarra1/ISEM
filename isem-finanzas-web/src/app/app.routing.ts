import {Routes} from '@angular/router';

// Layouts
import {CommonLayoutComponent} from './@espire/common/common-layout.component';
import {AuthenticationLayoutComponent} from './@espire/common/authentication-layout.component';
import {AuthGuard} from './@finanzas/@common/guards/auth.guard';

export const AppRoutes: Routes = [
  {
    path: 'finanzas',
    component: CommonLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./@finanzas/@common/pages/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'auditorias',
        loadChildren: () => import('./@finanzas/@auditorias/pages/auditorias-app.module').then(m => m.AuditoriasAppModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'suficiencias',
        loadChildren: () => import('./@finanzas/@suficiencias/pages/suficiencias-app.module').then(m => m.SuficienciasAppModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reportes',
        loadChildren: () => import('./@finanzas/@common/pages/reportes/reportes.module').then(m => m.ReportesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./@finanzas/@common/pages/altaUsuarios/altaUsuarios.module').then(m => m.AltaUsuariosModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: 'finanzas',
    component: AuthenticationLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./@finanzas/@common/pages/session/session.module').then(m => m.SessionModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'finanzas'
  }
];

