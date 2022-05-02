1) Payment types:Hardcoded
Payment-providers: db.json > paymentTypes."name" > "providers
Payment-providers-icon: db.json > paymentTypes."name" > icon
findProvider:Payment providers []


BANK-TRANSFER
1.icon :  cards.icon (need to add in db.json) . if there is no icon for bank-type > <i class="fas fa-money-check-alt"></i>
2.amount:cards.amount
3.cardNumber:cards.account
4.transferTo:cards.account
5.beneficiary:users.Full_Name
6.amount:HardCoded
7.Currency:?
8.transferType:HardCoded

9.Submit: Save data as object which we will use in transaction component.

EL-PAYMENTS
1.SelectPaymentSystem:array of Payment-providers
2. [ {{PayPal}} = dynamic ] account
2.Enter email account: user.email [not current user !]
3.Fee:[1%] > to usd


Issues:

1)First letter must be a capital.


#