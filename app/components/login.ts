import {Component} from "angular2/core"
import {FormBuilder, Validators, ControlGroup} from "angular2/common"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {TimerWrapper} from 'angular2/src/facade/async'
import {PromiseWrapper} from 'angular2/src/facade/promise'
import {Router, ROUTER_DIRECTIVES} from 'angular2/router'
import {AuthHttp} from '../service/jwt'
import {Logger} from '../service/logger'
import {status, json} from '../utils/fetch'
import {Start} from "../components/start"
import {User} from "../models/user"
import {UserService} from "../service/user"

//let template = require('./list.html');

@Component({
    selector: 'login',
    templateUrl: "app/components/login.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class Login {

    submitting = false;

    private timeoutId: number

    public model: User

    public form: ControlGroup

    constructor(public router: Router, public builder: FormBuilder, public userService : UserService) {
        this.reset()
        function emailValidator(control) {
            if (!control.value.match(/^[a-zA-Z0-9\_\.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+$/)) {
                return { invalidEmail: true };
            }
        }
        this.form = builder.group({
            username: [
              "",
              Validators.compose([Validators.required, emailValidator]),
              Validators.composeAsync([
                asyncValidator.bind(this)
              ])
            ],
            password: ["", Validators.required]
        });

        function asyncValidator(control) {
            var completer = PromiseWrapper.completer();
            if (this.timeoutId) {
              clearTimeout(this.timeoutId)
            }
            this.timeoutId = TimerWrapper.setTimeout(() => {
              this.userService.checkExists(this.model).then(() => {
                completer.resolve();
              }).catch((error) => {
                completer.resolve({exists:true})
              })

            }, 250);
            return completer.promise;
        }
    }

    reset(){
      this.model = new User("","")
    }

    onSubmitFormModel(){
      this.submitting = true;
      console.log("onsubmit", arguments)

      this.userService.login(this.model)
        .then(() => {
          console.log("login component ok")
          this.router.parent.navigateByUrl('/panel');
        })
        .catch((error) => {
          console.log("login component error catch: ", error.message);
          this.form.controls["password"].setErrors({invalid:true})
          console.log(this.form.controls["password"])
        }).then(() => {
          this.submitting = false;
          console.log("login component All done")
        })

    }


    // TODO: Remove this when we're done
    // get diagnostic() { return JSON.stringify(this.model); }

}
