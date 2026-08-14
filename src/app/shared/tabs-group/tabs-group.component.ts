import { AfterContentInit, Component, ContentChildren, OnInit, Output, QueryList,EventEmitter } from '@angular/core';
import { SingleTab } from './tab.component';

interface tabtype {
  TitleText : string,
  isActiveTab : boolean
}

@Component({
  standalone: false,
  selector: 'app-tabs-group',
  templateUrl: './tabs-group.component.html',
  styleUrls: ['./tabs-group.component.scss'],
})
export class TabsGroupComponent implements OnInit, AfterContentInit {

  @Output() tabclick : EventEmitter<any> = new EventEmitter<any>()

  constructor() { }
  ngOnInit(): void {}


  @ContentChildren(SingleTab) alltabs !: QueryList<SingleTab>

  ngAfterContentInit(): void {
    const tabs = this.alltabs?.toArray() ?? [];
    if (tabs.length && !tabs.some(tab => tab.isActiveTab)) {
      this.showactive(tabs[0]);
    }
  }



  showactive (element : SingleTab) {
    this.alltabs.toArray().forEach(element =>{
      return element.isActiveTab = false
    })
    element.isActiveTab = true

    this.tabclick.emit(`${element.TitleText} clicked`)
  }

}
