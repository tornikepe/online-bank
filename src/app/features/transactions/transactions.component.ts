import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(private transactionService: TransactionsService, private userService: UserService) { }

  currentElementForModal: elementType;
  modalOpen = false;

  //data arrays
  transactionArray!: any;
  data!: any;

  //scroll binding
  throttle = 2;
  scrollDistance = 1;

  getCloseModal(searchElement: any, wholeTransaction: any) {
    this.modalOpen = false;
  }
  getCurrentElement(element: any, searchElement: any, wholeTransaction: any) {
    this.modalOpen = true;
    this.currentElementForModal = element;
  }

  // filter variables
  searchValue: string = '';
  typeValue: string = 'All';
  dateValue: string = 'All Time';

  //empty transactions
  emptyTransactions = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.transactionService.currentUserId = this.userService.activeUser.id;
      let id = this.transactionService.currentUserId;
      this.transactionService.getData().subscribe((data) => {
        this.data = data
          .filter(
            (t: any) => t.transferFromUserId === id || t.transferToUserId === id
          )
          .map((t: any) => {
            if (t.transferFromUserId === id) {
              t.description = t.type + ' to ' + t.currTransferToUser;
              t.amount = '-$' + t.amount;
              return t;
            } else {
              t.description = t.type + ' from ' + t.currTransferFromUser;
              t.amount = '+$' + t.amount;
              return t;
            }
          })
          .reverse();

        this.transactionService.filteredTransactions$.next(this.data);

        // this.transactionService.filteredTransactions = this.data;

        if (this.data.length == 0) this.emptyTransactions = true;

        this.transactionArray = this.data.slice(0, 13);
      });
    }, 0);
    //retrieve transactions data
  }

  onFind(result: any, container: HTMLDivElement) {
    this.searchValue = result;
    this.transactionArray = this.transactionService
      .universalFilter(
        this.data,
        this.searchValue,
        this.typeValue,
        this.dateValue
      )
      .slice(0, 13);

    container.scroll(0, 0);
  }

  onSort(result: any, container: HTMLDivElement) {
    this.typeValue = result;

    this.transactionArray = this.transactionService
      .universalFilter(
        this.data,
        this.searchValue,
        this.typeValue,
        this.dateValue
      )
      .slice(0, 13);

    container.scroll(0, 0);
  }

  onSortDate(result: any, container: HTMLDivElement) {
    this.dateValue = result;
    this.transactionArray = this.transactionService
      .universalFilter(
        this.data,
        this.searchValue,
        this.typeValue,
        this.dateValue
      )
      .slice(0, 13);

    container.scroll(0, 0);
  }

  onScroll() {
    let id = this.transactionArray.length;
    let newData = this.transactionService.universalFilter(
      this.data,
      this.searchValue,
      this.typeValue,
      this.dateValue
    )[id];

    if (newData) this.transactionArray = [...this.transactionArray, newData];
  }
}

export interface elementType {
  id: number;
  account: string;
  img: string;
  description: string;
  date: any;
  type: string;
  amount: number;
}
