import {Component, OnInit} from '@angular/core';
import {TemplateService} from '../../shared/services/template.service';
import {LocalStorageService} from '../../../@finanzas/@common/services/local-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  searchModel: string;
  isCollapse: boolean;
  isOpen: boolean;
  searchActived = false;

  user: string;

  constructor(
    private router: Router,
    private tplSvc: TemplateService,
    private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.tplSvc.isSideNavCollapseChanges.subscribe(isCollapse => this.isCollapse = isCollapse);
    this.tplSvc.isSidePanelOpenChanges.subscribe(isOpen => this.isOpen = isOpen);

    const currentUser = JSON.parse(localStorage.getItem('usuario'));

    if (currentUser) {
      this.user = currentUser.nombre + ' ' + currentUser.apellido_paterno + ' ' + currentUser.apellido_materno;
    }
  }

  toggleSideNavCollapse() {
    this.isCollapse = !this.isCollapse;
    this.tplSvc.toggleSideNavCollapse(this.isCollapse);
  }

  toggleSidePanelOpen() {
    this.isOpen = !this.isOpen;
    this.tplSvc.toggleSidePanelOpen(this.isOpen);
  }

  toggleSearch() {
    this.searchActived = !this.searchActived;
    console.log(this.searchActived);
  }

  signOut() {

    this.localStorageService.clearToken();

    this.router.navigateByUrl('/finanzas/login');
  }
}
