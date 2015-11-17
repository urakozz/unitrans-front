import {Component, View} from "angular2/angular2"


@Component({
    selector: 'start'
})
@View({
    template: '<h1>Start</h1><p>Token:{{token}}'
})
export class Start {
    token: string
    constructor() {
      this.token = localStorage.getItem("jwt")
    }
}
