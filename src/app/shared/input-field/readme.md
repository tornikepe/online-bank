***თქვენს წინაშეა 2.0 input***

მშობელში გამოიყენეთ როგორც 

<app-input-field [label]="'lebel'" [width]="'400px'" [inputClass] = "'input-warn'">
    <input type="text" name="lastName" placeholder="placeholder" [disabled]=false value="email" />
</app-input-field>

</app-input-field> ასრულებს უბრალოდ ვრაპერის ფუნქციას რათა სტილების დაწერა აღარ მოგიწიოთ

1) </app-input-field>  გადაეცით  ***label, width, inputClass***  
2) width - ს გადაცემის გარეშე დაიკავებს მშობელი კომპონენტის 100%
3) [inputClass] = "'input-warn' / 'input-success'" 
4) </app-input-field> შიგნით გადაეცით ინფუთი, რომელსაც გამოიყენებთ ჩვეულებრივად, ჩასვამთ და აიღებთ  value - ს, გაუწერთ formControlName - ს და ა.შ.   



**Forms Example**

<form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
    <app-input-field [label]="'lebel'" [width]="'400px'">
        <input type=" text" name="firstName" formControlName="firstname" />
    </app-input-field>
    <app-input-field [label]="'lebel'" [width]="'400px'">
        <input type=" text" name="lastName" formControlName="lastname" />
    </app-input-field>
    <button type="submit">Submit</button>
</form>