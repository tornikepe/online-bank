import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, DestroyRef, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import TRANSACTION Interface

@Component({
  standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  public form: FormGroup;
  @Output() public searchResult = new EventEmitter<any[]>(); // any = transaction

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = fb.group({
      search: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.get('search')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.searchResult.emit(value);
          this.cdr.markForCheck();
    });
  }
}
