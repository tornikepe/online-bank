import { Component, Input, OnInit, Output, EventEmitter, HostListener } from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent implements OnInit {
  @Output("currentPage") recentPage = new EventEmitter<number>();
  @Input() border: boolean;
  @Input() dataPerPage: number;
  @Input() totalData: number;
  screenWidth: number;
  totalPages: number;
  pagesArr: number[] = [];
  displayedPages: number[] = [];
  currentPage: number = 1;
  prevPage: number;
  nextPage: number;

  constructor() {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.totalPages = Math.ceil(this.totalData / this.dataPerPage);

    for (let i = 1; i <= this.totalPages; i++) {
      this.pagesArr.push(i);
    }
    this.displayPages();
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.displayPages();
  }

  pageClickHandler(nextPage: number) {
    this.currentPage = nextPage;
    this.displayPages();
  }

  prevClickHandler() {
    this.currentPage--;
    this.displayPages();
  }

  nextClickHandler() {
    this.currentPage++;
    this.displayPages();
  }

  displayPages() {
    this.recentPage.emit(this.currentPage);
    const lastPage = this.pagesArr.length;
    let counter = 0;

    if (this.screenWidth < 450) {
      this.displayedPages = [];
      if (this.currentPage < 2) {
        for (let j = 1; j <= 3; j++) {
          this.displayedPages[j - 1] = j;
        }
      } else if (this.currentPage + 1 <= lastPage) {
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          this.displayedPages[counter] = i;
          counter++;
        }
      } else {
        for (let i = lastPage - 2; i <= lastPage; i++) {
          this.displayedPages[counter] = i;
          counter++;
        }
      }
    } else if (this.screenWidth >= 450) {
      if (this.currentPage < 3) {
        for (let j = 1; j <= 5; j++) {
          this.displayedPages[j - 1] = j;
        }
      } else if (this.currentPage + 2 <= lastPage) {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          this.displayedPages[counter] = i;
          counter++;
        }
      } else {
        for (let i = lastPage - 4; i <= lastPage; i++) {
          this.displayedPages[counter] = i;
          counter++;
        }
      }
    }
  }
}
