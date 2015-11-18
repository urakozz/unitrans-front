import {Injectable, bind} from "angular2/angular2"
import {Http} from "angular2/http"
import {User} from "../models/user"
import {status, json} from '../utils/fetch'

/**
 * UserService manages our current user
 */
@Injectable()
export class UserService {
    // `currentUser` contains the current user
    // currentUser: Rx.Subject<User> = new Rx.BehaviorSubject<User>(null);

    user: User
    in = false
    token: string
    username: string

    private host: string

    constructor(config?:any){
      config = config || {}
      this.host = config.host || "http://localhost:8088"
      this.onLoad()
    }

    // public setCurrentUser(newUser: User): void {
    //     this.currentUser.onNext(newUser);
    // }

    public login(user: User) {

      this.user = user
      return this
        .loginPromise()
        .then((token: string) => this.authenticate(this.user, token))
        .catch(err => {
          console.log("user service -> login, err", err)
          this.logout()
          return Promise.reject(err)
        })
    }


    public checkExists(user: User) {

      this.user = user
      return this
        .checkExistsPromise()
        .catch(err => {
          return Promise.reject(err)
        })
    }

    public signup(user: User) {

      this.user = user
      return this
        .signupPromise()
        .then(this.loginPromise.bind(this))
        .then((token: string) => this.authenticate(this.user, token))
        .catch(err => {
          console.log("user service -> signup, err", err)
          this.logout()
          return Promise.reject(err)
        })
    }



    public logout() {
        this.in = false
        this.token = ""
        this.user = null
        this.username = ""
        localStorage.removeItem('jwt');
        localStorage.removeItem('username');
    }

    private onLoad(){
      var token = localStorage.getItem('jwt')
      var username = localStorage.getItem('username')
      if (token && username) {
        this.authenticate(new User(username, ""), token)
      }
    }

    private authenticate(user: User, token: string) {
      this.token = token
      this.in = true
      this.username = user.username
      localStorage.setItem('jwt', token)
      localStorage.setItem("username", user.username)
    }


    private checkExistsPromise() {
        return window.fetch(this.host + '/webapi/checkExists', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.user.username, password: this.user.password
            })
        })
            .then(status)
            .catch((err) => Promise.reject(err))
    }



    private loginPromise() {
        return window.fetch(this.host + '/webapi/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.user.username, password: this.user.password
            })
        })
            .then(status)
            .then(json)
            .then((response: any) => {
                console.log("login promise ok")
                console.log(response)
                return response.token
            })
            .catch((err) => Promise.reject(err))
    }

    private signupPromise() {
        return window.fetch(this.host + '/webapi/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.user.username, password: this.user.password
            })
        })
            .then(status)
            .then(json)
            .catch((err) => Promise.reject(err))
    }

}
