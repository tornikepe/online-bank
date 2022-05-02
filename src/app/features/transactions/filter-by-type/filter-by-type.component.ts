import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-filter-by-type",
  templateUrl: "./filter-by-type.component.html",
  styleUrls: ["./filter-by-type.component.scss"],
})
export class FilterByTypeComponent implements OnInit {
  @Output() sortResults = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  sortByType(type: string) {
    this.sortResults.emit(type);
  }
}
