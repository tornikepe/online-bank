import { ChangeDetectorRef, Component, HostListener, OnInit, DestroyRef, inject} from '@angular/core';
import { Card } from 'src/app/models/banking.model';
import { LayoutService } from '../services/layout.service';
import { CardService } from '../../features/accounts/card.service';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  isCollapsed: boolean;
  screenSize: number;
  cardsArray: Card[] = [];
  constructor(
    private ls: LayoutService,
    private CardService: CardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ls.sidebarStatus$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.isCollapsed = value;
        this.cdr.markForCheck();
      });

    this.CardService.getCards().subscribe(data => {
      this.cardsArray = data;
          this.cdr.markForCheck();
    });
    this.screenSize = window.innerWidth;
    if (this.screenSize < 900) {
      this.ls.updateStatus(true);
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.screenSize = window.innerWidth;
    if (this.screenSize < 900) {
      if (!this.isCollapsed) {
        this.ls.updateStatus(true);
      }
    } else {
      if (this.isCollapsed) {
        this.ls.updateStatus(false);
      }
    }
  }
}
