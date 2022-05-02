import { AfterContentInit, Component, ContentChildren, OnInit, Output, QueryList,EventEmitter } from '@angular/core';
import { SingleTab } from './tab.component';

interface tabtype {
  TitleText : string,
  isActiveTab : boolean
}

@Component({
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
    var anyActiveTab : boolean = false
    for (let i of this.alltabs) {
      if (i.isActiveTab) {
        anyActiveTab = true
      }
    }
    if (!anyActiveTab) {
      this.showactive(this.alltabs['_results'][0])
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
