    <app-input
            [label]="'lebel'"
            [type]="'text'"
            [name]="'lastName'"
            [placeholder]="'placeholder'"
            [disabled] = 'true'
            [value] = " 'some text' "
            [width] = " '200px' "
            [inputClass] = "'input-warn'"
            (inputValue)='parentComponentMethod($event)'>
    </app-input>

**_app-input კომპონენტში გაერთიანებულია label და input_**

1. label - ის გადასაცემად <app-input [label] = "'Firstname'"></app-input>
   ** თუ html - იდან გადასცემ ტექსტს, იყენებ ჯერ ორმაგ ბრჭყალებს, შემდეგ ერთმაგ ბრჭყალებში ჩასმულ შენს ტექსტს (ან პირიქით)
   ** თუ კომპონენტიდან იყენებ ცვლადს <app-input [label] = "varName"></app-input> უბრალოდ ბრჭყალებში სვამ

2. იგივე ლოგიკა ვრცელდება დანარჩენზე [name], [placeholder], [type], [value], [inputClass], [disabled], [width]

3. <app-input (inputValue)='parentComponentMethod($event)'></app-input> ყოველ keyup - ზე დააემითებს ჩაწერილ მნიშვნელობას.

4. [inputClass] = "'input-warn'" ან "'input-success'"

5. [width] - ის გარეშე, კომპონენტი აიღებს მშობლის 100% - ს
