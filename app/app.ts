/// <reference path="./typings/app.d.ts" />

import {Component, bootstrap, provide, FORM_DIRECTIVES, CORE_DIRECTIVES, Injectable, View} from 'angular2/angular2'
import {Http, HTTP_PROVIDERS, HTTP_BINDINGS} from 'angular2/http'
import {ROUTER_BINDINGS, LocationStrategy} from 'angular2/router'
import {ROUTER_DIRECTIVES, RouteConfig, RouterOutlet, Router, RouterLink, Location} from 'angular2/router'
import {LoggedInRouterOutlet} from './utils/routerOutlet';
// import {FirebaseRef as firebase} from './service/firebase'
import {Hero} from "./service/hero/hero"
import {HeroService} from "./service/hero-service"
import {Logger} from "./service/logger"
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {Start} from "./components/start"
import {List} from "./components/list"
import {Login} from "./components/login"
import {Signup} from "./components/signup"

import {Panel} from "./components/private/panel"

//
// firebase.child("messages").on("value", function(snapshot) {
//   console.log(snapshot.val());  // Alerts "San Francisco"
// });
@Component({
    selector: 'unitrans-app',
})
@View({
  directives: [CORE_DIRECTIVES,LoggedInRouterOutlet,RouterLink],
  templateUrl:"templates/app_main.html"
})
@RouteConfig([
  { path: '/', component: Start, as:"Start" },
  { path:"/list", component: List, as:"List"},
  { path:"/login", component: Login, as:"Login"},
  { path:"/signup", component: Signup, as:"Signup"},
  { path:"/panel", component: Panel, as:"Panel"}
])
class AppComponent {

    constructor(public userService: UserService, public router: Router) {
      console.log("app user in", userService.in)
    }

    logout(){
      this.userService.logout()
      this.router.navigateByUrl('/')
    }


}

bootstrap(AppComponent, [
  ROUTER_BINDINGS,
  HTTP_BINDINGS,
  Logger,
  provide(UserService, { useFactory: () => {
    return new UserService({
      host:"https://transpoint.herokuapp.com"
    })
  }}),
  provide(AuthHttp, { useFactory: () => {
    return new AuthHttp({
      tokenName: "jwt",
      host:"https://transpoint.herokuapp.com"
    })
  }})
]);
