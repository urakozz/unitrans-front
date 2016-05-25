import {Component} from "@angular/core"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common'
import {Router} from '@angular/router'
import { Observable } from 'rxjs/Observable';

import {AuthHttp} from '../../service/jwt'
import {UserService} from "../../service/user"
import {MATERIAL_DIRECTIVES} from "ng2-material";

@Component({
    selector: 'panel',
    templateUrl: "app/components/private/panel.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, MATERIAL_DIRECTIVES]
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
              }, (err) => {
                this.userService.logout()
                this.router.navigate(['/']);
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
