import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardService } from '../../accounts/card.service';

@Component({
  standalone: false,
  selector: 'app-yourcards',
  templateUrl: './yourcards.component.html',
  styleUrls: ['./yourcards.component.scss'],
})
export class YourcardsComponent implements OnInit {
  cards: any[] = [];
  loading = true;

  constructor(
    private cardService: CardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cardService.getCards().subscribe({
      next: (cards) => {
        this.cards = cards ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /* Visa numbers start with a 4; everything else in the demo data is Mastercard. */
  isVisa(card: any): boolean {
    return String(card?.card ?? '').startsWith('4');
  }

  isBlocked(card: any): boolean {
    return Number(card?.amount) <= 0;
  }
}
