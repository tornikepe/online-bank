import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressbarComponent implements OnInit {
  @Input() percent: number = 0;
  @Input() color: 'primary' | 'green' | 'pink' | 'blue' = "primary";

  backgroundColor(): string {
    switch (this.color) {
      case 'primary':
        return '#FFAB2B';
      case 'green':
        return '#6DD230';
      case 'pink':
        return '#FE4D97'
      case 'blue':
        return '#4D7CFE'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }

}

