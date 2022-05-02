import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ListWithIcons } from "./list-with-icons.model";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownComponent implements OnInit {
  @Input() list?: string[];
  @Output() selectedItem = new EventEmitter<any>();

  @Input() public disabled: boolean = false;
  @Input() public includeIcons: boolean = false;
  @Input() public invisibleBorder: boolean = false;
  @Input() public fontSize: string = "14px";

  @Input() public selected: any = "";

  @Input() public listWithIcons: {
    iconClass: string;
    value: string;
    secondValue?: string;
  }[];

  public itemSelection: boolean = false;
  private touched: boolean = false;
  public firstItem: string | ListWithIcons = this.selected;
  public secondValue?: string;
  public iconClass: string;

  constructor() {}

  ngOnInit(): void {
    this.firstItem =
      this.list && !this.listWithIcons
        ? this.list[0]
        : this.listWithIcons[0].value;
    if (!this.list && !this.selected && this.listWithIcons) {
      this.iconClass = this.listWithIcons[0].iconClass;
      this.secondValue = this.listWithIcons[0]?.secondValue;
    }

    // if (!this.selected) {
    //   this.onSelectItem(this.firstItem);
    // }
  }

  public onClick(): void {
    if (this.disabled) return;
    this.itemSelection = !this.itemSelection;
  }

  public onSelectItem(newValue: string | ListWithIcons): void {
    this.touched = true;

    if (typeof newValue !== "string") {
      // if value is an object
      this.selected = newValue.value;
      this.iconClass = newValue.iconClass;
      this.secondValue = newValue.secondValue;
      this.selectedItem.emit({
        value: this.selected,
        secondValue: this.secondValue ? this.secondValue : "",
      });
    } else {
      this.selected = newValue;
      this.selectedItem.emit(this.selected);
    }
    this.itemSelection = false;
  }

  // methods for ngClasses
  public displaySelected(current: string) {
    if (!this.selected && current === this.firstItem)
      return { picked: true, disabled: this.disabled };

    return {
      picked: current === this.selected,
      disabled: this.disabled,
    };
  }

  public displayPlaceholder() {
    return {
      placeholder: this.selected && !this.touched,
      disabled: this.disabled,
    };
  }
}
