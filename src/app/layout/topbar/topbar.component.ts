import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { LayoutService } from "../services/layout.service";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  title: any;
  isCollapsed: boolean = false;
  constructor(private ls: LayoutService, private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        if (event.url === '/') {
          this.title = 'dashboard';
        } else {
          this.title = event.url.split('/')[1];
        }
      });
  }

  ngOnInit(): void {}

  onClick() {
    this.ls.updateStatus((this.isCollapsed = !this.isCollapsed));
  }
}
