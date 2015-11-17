import {Component, View, FormBuilder, Validators, ControlGroup} from "angular2/angular2"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/angular2'
import {Router} from 'angular2/router'
import {Http, Request, RequestOptions, RequestMethods, Headers} from "angular2/http"
import {AuthHttp} from '../service/jwt'
import {Logger} from '../service/logger'
import {status, json} from '../utils/fetch'
import {Start} from "../components/start"
import {User} from "../models/user"
import {UserService} from "../service/user"

//let template = require('./list.html');

@Component({
    selector: 'login'
})
@View({
    templateUrl: "app/components/login.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class Login {

    submitting = false;

    public model: User

    public form: ControlGroup

    constructor(public router: Router, public builder: FormBuilder, public userService : UserService) {
        this.reset()
        function emailValidator(control) {
            if (!control.value.match(/^.+\@.+\..+/)) {
                return { invalidEmail: true };
            }
        }
        this.form = builder.group({
            username: ["", Validators.compose([Validators.required, emailValidator])],
            password: ["", Validators.required]
        });
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
      }).then(() => {
        this.submitting = false;
        console.log("login component All done")
      })

    }


    // TODO: Remove this when we're done
    // get diagnostic() { return JSON.stringify(this.model); }


    signupLink(event) {
        event.preventDefault();
        this.router.parent.navigateByUrl('/signup');
    }

}
