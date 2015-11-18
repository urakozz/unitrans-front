import {Component, View} from "angular2/angular2"
import {Observable} from 'angular2/angular2';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2'
import {Router} from 'angular2/router'

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
            .map((res: Response) => res.json())
            .subscribe((user:any) => {
              console.log(user)
                this.keys = user.keys
            });
    }

    add(){
      this.http.post("/webapi/keys", "")
          .map((res: Response) => res.json())
          .subscribe((user:any) => {
              this.keys = user.keys
          });
    }

    delete(event, id){
      this.http.delete("/webapi/keys/"+id)
          .map((res: Response) => res.json())
          .subscribe((user:any) => {
              this.keys = user.keys
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
