import { Component, Input } from "@angular/core";


@Component({
    selector : "app-tab",
    template : `<div *ngIf="isActiveTab"> <ng-content></ng-content></div>`,
})

export class SingleTab {
    @Input() TitleText !: string
    @Input() isActiveTab : boolean = false

}