import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { LayoutService } from "../services/layout.service";

@Component({
  standalone: false,
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  title: any;
  isCollapsed: boolean = false;
  constructor(private ls: LayoutService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(event => {
        if (event.url === '/') {
          this.title = 'dashboard';
        } else {
          this.title = event.url.split('/')[1];
        }
              this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {}

  onClick() {
    this.ls.updateStatus((this.isCollapsed = !this.isCollapsed));
  }
}
