import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ListWithIcons } from "./list-with-icons.model";

@Component({
  standalone: false,
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

  /* Every dropdown used to hardcode name="category" on its radios and derive
     each radio's id from the item text. Two dropdowns on the same page therefore
     shared one radio group — picking a currency cleared the selected account —
     and repeated item text produced duplicate ids, so a <label for> could point
     at another dropdown's input. Both are now scoped per instance. */
  private static nextGroupId = 0;
  public readonly groupName = `dropdown-${DropdownComponent.nextGroupId++}`;

  /** Stable, unique, selector-safe id for one item's radio input. */
  public optionId(index: number): string {
    return `${this.groupName}-option-${index}`;
  }

  public itemSelection: boolean = false;
  private touched: boolean = false;
  public firstItem: string | ListWithIcons = this.selected;
  public secondValue?: string;
  public iconClass: string;

  constructor() {}

  ngOnInit(): void {
    /* Both lists are optional inputs, so neither may be present. */
    this.firstItem =
      this.list && !this.listWithIcons
        ? this.list[0]
        : this.listWithIcons?.[0]?.value;
    if (!this.list && !this.selected && this.listWithIcons?.length) {
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

  /* This used to read `this.selected && !this.touched`, which greyed the text
     out precisely when a real value was present but the user had not picked it
     by hand — a saved setting looked unset until you re-chose it. Only an
     absent selection is a placeholder. */
  public displayPlaceholder() {
    return {
      placeholder: !this.selected,
      disabled: this.disabled,
    };
  }
}
