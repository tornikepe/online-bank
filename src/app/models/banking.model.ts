/**
 * Shapes returned by the mock API.
 *
 * The services used to hand `any` around, so a typo in a field name or a change
 * in the API surfaced only as a blank panel at runtime. These interfaces cover
 * the records the app actually reads.
 */

export interface User {
  id: number;
  email: string;
  Full_Name: string;
  Agree_Term?: boolean;
  phone?: string;
  language?: string;
  sex?: string;
  /* Only ever sent when changing the password — the app strips it from any
     profile it holds in memory. */
  password?: string;
}

export interface Card {
  id: number;
  userId: number;
  name: string;
  account: string;
  /** Card number, digits only. */
  card: string;
  cardholder: string;
  /** Expiry, MM/YY. */
  date: string;
  amount: number;
  security: boolean;
}

export interface Deposit {
  id: number;
  userId: number;
  name: string;
  account: string;
  rate: number;
  dateStart: string;
  dateExp: string;
  balance: number;
  accured: number;
}

export interface Loan {
  id: number;
  userId: number;
  name: string;
  account: string;
  rate: number;
  dateStart: string;
  dateExp: string;
  startingAmount: number;
  paidAmount: number;
}

/** The UI renders each part separately, so dates are stored pre-split. */
export interface TransactionDate {
  year: number;
  longMonth: string;
  shortMonth: string;
  day: number;
  hoursNMinutes: string;
  ampm: 'AM' | 'PM' | string;
}

export interface Transaction {
  id: number;
  account: string;
  transferedTo: string;
  date: TransactionDate;
  amount: number;
  currency: string;
  type: string;
  transferFromUserId: number;
  currTransferFromUser: string;
  transferToUserId: number;
  currTransferToUser: string;
  img?: string;
  /** Added client-side when the list is rendered. */
  description?: string;
}

/**
 * A transaction as the transactions list renders it. Building the list replaces
 * the numeric amount with a signed, pre-formatted string — "-$480" — and adds
 * the sentence shown under the title, so this is not a `Transaction`.
 */
export type DisplayTransaction = Omit<Transaction, 'amount'> & {
  amount: string;
  description: string;
};

export interface PaymentProvider {
  name: string;
  providers: { name: string }[];
  icon: string;
  /** Identifies which transfer form to open. */
  formPath: 'bank-transfer' | 'electronic-payment' | 'internal-transfer' | string;
}

export interface PaymentLimits {
  id: number;
  userId: number;
  cashWithdrawals: number;
  bankTransactions: number;
  onlinePayments: number;
}

export interface UserNotification {
  id: number;
  userId: number;
  title: string;
  value: string;
  link: string;
}

/** One of the three balance sparklines on the accounts page. */
export interface BalanceChart {
  id: number;
  name: string;
  data: number[];
}

/** One bar on the Reports page's "accounts spendings" panel. */
export interface SpendingTotal {
  type: string;
  userId: number;
  value: number;
}

/** One slice of the Reports page's expense-category donut. */
export interface ExpenseCategory {
  type: string;
  userId: number;
  value: number;
}

/** A monthly income or expense series, one record per account kind. */
export interface MoneySeries {
  userId: number;
  type: string;
  data: number[];
}
