import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
// import TRANSACTION Interface

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public form: FormGroup;
  @Output() public searchResult = new EventEmitter<any[]>(); // any = transaction

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      search: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.get('search')?.valueChanges.subscribe((value) => {
      this.searchResult.emit(value);
    });
  }
}
