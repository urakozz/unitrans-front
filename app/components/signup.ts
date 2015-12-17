import {Component, View} from "angular2/core"
import {FormBuilder, Validators, ControlGroup} from "angular2/common"
import {TimerWrapper} from 'angular2/src/facade/async';
import {PromiseWrapper} from 'angular2/src/facade/promise';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {Router} from 'angular2/router'
import {AuthHttp} from '../service/jwt'
import {Logger} from '../service/logger'
import {status, json} from '../utils/fetch'
import {Start} from "../components/start"
import {User} from "../models/user"
import {UserService} from "../service/user"

//let template = require('./list.html');

@Component({
    selector: 'signup'
})
@View({
    templateUrl: "app/components/signup.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class Signup {

    private timeoutId: number

    public model: User

    public form: ControlGroup

    submitting = false

    constructor(public router: Router, public builder: FormBuilder, public userService: UserService) {
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
               ])],
            password: ["", Validators.required]
        });

        function asyncValidator(control) {
            var completer = PromiseWrapper.completer();
            if (this.timeoutId) {
              clearTimeout(this.timeoutId)
            }
            this.timeoutId = TimerWrapper.setTimeout(() => {
              this.userService.checkExists(this.model).then(() => {
                completer.resolve({exists:true});
              }).catch((error) => {
                completer.resolve(null)
              })
            }, 250);
            return completer.promise;
        }

    }

    private reset(){
      this.model = new User("","")
    }

    onSubmitFormModel(){

      this.submitting = true;

      this.userService.signup(this.model)
      .then(() => {
        console.log("singup component ok")
        this.router.parent.navigateByUrl('/panel');
      })
      .catch((error) => {
        console.log("signup component error catch: ", error.message);
      }).then(() => {
        this.submitting = false;
        console.log("signup component All done")
      })

    }


    loginLink(event){
      event.preventDefault();
      this.router.parent.navigateByUrl('/login');
    }

    // TODO: Remove this when we're done
    // get diagnostic() { return JSON.stringify(this.model); }

}
