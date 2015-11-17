import {Hero} from "./hero/hero"
import {HEROES} from "./hero/heroes-mock"

import {Injectable, Inject} from 'angular2/angular2';
import {Logger} from './logger';

@Injectable()
export class HeroService {
  heroes: Hero[]

  constructor(private logger:Logger){
    this.heroes = HEROES
  }
  gerHeroes() {
    this.logger.log("retrieving heroes")
    return this.heroes
  }
}
