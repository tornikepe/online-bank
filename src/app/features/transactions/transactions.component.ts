import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { DisplayTransaction } from 'src/app/models/banking.model';
import { UserService } from 'src/app/services/user.service';
import { TransactionsService } from './transactions.service';

@Component({
  standalone: false,
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(private transactionService: TransactionsService, private userService: UserService, private cdr: ChangeDetectorRef) { }

  currentElementForModal: DisplayTransaction;
  modalOpen = false;

  //data arrays
  transactionArray: DisplayTransaction[] = [];
  data: DisplayTransaction[] = [];

  //scroll binding
  throttle = 2;
  scrollDistance = 1;

  getCloseModal(searchElement: HTMLElement, wholeTransaction: HTMLElement) {
    this.modalOpen = false;
  }
  getCurrentElement(
    element: DisplayTransaction,
    searchElement: HTMLElement,
    wholeTransaction: HTMLElement
  ) {
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
    /* The user id comes from localStorage, so it is available synchronously —
       no setTimeout needed to wait for the profile request to land. The data
       stores it inconsistently as both a number and a string, hence the
       loose comparison. */
    this.transactionService.currentUserId = this.userService.activeUserId;
    const id = this.transactionService.currentUserId;
    this.transactionService.getData().subscribe((data) => {
        this.data = data
          .filter(
            (t) => t.transferFromUserId == id || t.transferToUserId == id
          )
          .map((t): DisplayTransaction => {
            /* The row shows a signed, pre-formatted amount, so the numeric one
               is replaced rather than edited in place. */
            const outgoing = t.transferFromUserId == id;
            return {
              ...t,
              description: outgoing
                ? `${t.type} to ${t.currTransferToUser}`
                : `${t.type} from ${t.currTransferFromUser}`,
              amount: `${outgoing ? '-' : '+'}$${t.amount}`,
            };
          })
          .reverse();

        this.transactionService.filteredTransactions$.next(this.data);

        // this.transactionService.filteredTransactions = this.data;

        if (this.data.length == 0) this.emptyTransactions = true;

        this.transactionArray = this.data.slice(0, 13);
        this.cdr.markForCheck();
    });
    //retrieve transactions data
  }

  onFind(result: string, container: HTMLDivElement) {
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

  onSort(result: string, container: HTMLDivElement) {
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

  onSortDate(result: string, container: HTMLDivElement) {
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
