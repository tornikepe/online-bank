import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SingleTab } from "./tab.component";
import { TabsGroupComponent } from "./tabs-group.component";



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TabsGroupComponent,
        SingleTab
    ],
    exports: [
        TabsGroupComponent,
        SingleTab
    ]
})

export class TabsModule { }