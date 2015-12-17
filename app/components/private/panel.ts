import {Component, View} from "angular2/core"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {Router} from 'angular2/router'
import { Observable } from 'rxjs/Observable';

import {AuthHttp} from '../../service/jwt'
import {UserService} from "../../service/user"

@Component({
    selector: 'panel'
})
@View({
    templateUrl: "app/components/private/panel.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class Panel {

    public keys: string[];

    constructor(public http: AuthHttp, private userService: UserService, public router: Router) {
      if (userService.in){
        this.getKeys()
      }
    }

    private getKeys() {
        this.http.get("/webapi/keys")
            .subscribe(res => {
              console.log(res.json())
                this.keys = res.json().keys
            });
    }

    add(){
      this.http.post("/webapi/keys", "")
          .subscribe(res => {
              this.keys = res.json().keys
          });
    }

    delete(event, id){
      this.http.delete("/webapi/keys/"+id)
          .subscribe(res => {
              this.keys = res.json().keys
          });
    }

    test() {
        console.log(arguments)
        this.http.get("/webapi/test")
            .subscribe((res) => {
                console.log(res)
            });
    }

    // TODO: Remove this when we're done
    // get diagnostic() { return JSON.stringify(this.keys); }
}
