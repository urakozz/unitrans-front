import {Component, View} from "angular2/core"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common';

import {Hero} from "../service/hero/hero";
import {HEROES} from "../service/hero/heroes-mock";

//let template = require('./list.html');

@Component({
  selector: 'list'
})
@View({
  templateUrl:"app/components/list.html",
  directives:[FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class List {
  public title = 'Tour of Heroes';
  public selectedHero: Hero;
  public heroes: Hero[];

  constructor(){
    this.heroes = HEROES
  }
  onSelect(hero: Hero) { this.selectedHero = hero; }
  getSelectedClass(hero: Hero) {
      return { 'selected': hero === this.selectedHero };
  }

}
