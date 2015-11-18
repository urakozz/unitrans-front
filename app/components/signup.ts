import {Component, View, FormBuilder, Validators, ControlGroup} from "angular2/angular2"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2'
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
            if (!control.value.match(/^\w+\@\w+\.\w+/)) {
                return { invalidEmail: true };
            }
        }
        this.form = builder.group({
            username: ["", Validators.compose([Validators.required, emailValidator])],
            password: ["", Validators.required]
        });
    }

    private reset(){
      this.model = new User("","")
    }

    // private emailValidator(control) {
    //   if (this.timeoutId) {
    //     clearTimeout(this.timeoutId)
    //   }
    //   this.timeoutId = setTimeout(() => {
    //     this.emailValid = !!control.value.match(/^.+\@.+\..+/)
    //     console.log("timeout set valid", this.emailValid)
    //   }, 250)
    //
    //   if (!this.emailValid) {
    //     return { invalidEmail: true }
    //   }
    // }

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
