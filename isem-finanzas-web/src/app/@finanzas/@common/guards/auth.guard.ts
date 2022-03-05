import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (route.routeConfig.path === 'login') {

      if (this.localStorageService.getJsonValue('isem-user')) {

        this.router.navigate(['/finanzas/home']);

        return false;
      }

      return true;

    } else {

      if (this.localStorageService.getJsonValue('isem-user')) {

        return true;

      }

      this.router.navigate(['/finanzas/login']);

      return false;
    }
  }

}
