**იმისთვის რომ გამოვიყენოთ კალენდარი საჭიროა ჩავამატოთ სამიდან, რომელიმე 
კალენდარი.**

>1. `<app-datepicker></app-datepicker>`
>2. `<app-datepicker-ranged></app-datepicker-ranged>`
>3. `<app-datepicker-slider></app-datepicker-slider>`

ინფორმაცია, რომ გამოვიტანოთ კალენდრიდან საჭიროა გამოვიყენოთ ბაინდინგი.
მაგალითად:

app.component.html
>`<app-datepicker (datepickerValue)="test($event)"></app-datepicker>`

app.component.ts
>`test(e: any) console.log(e)`

რაც დაგვიბრუნებს ობიექტს:
>`{year: 2016, month: 'October', day: 17}`


_~~დამატებითი კითხვებისთვის მომმართეთ :)~~_