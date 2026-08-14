import { ChangeDetectorRef, Component, Input } from "@angular/core";

@Component({
  standalone: false,
  selector: "app-tab",
  template: `<div *ngIf="isActiveTab"><ng-content></ng-content></div>`,
})
export class SingleTab {
  @Input() TitleText!: string;

  private _isActiveTab = false;

  /* TabsGroupComponent flips this field on the child instances directly rather
     than through a binding, so the child has to mark its own view dirty — a plain
     assignment from outside no longer triggers a repaint. */
  @Input()
  set isActiveTab(value: boolean) {
    this._isActiveTab = value;
    this.cdr.markForCheck();
  }

  get isActiveTab(): boolean {
    return this._isActiveTab;
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
