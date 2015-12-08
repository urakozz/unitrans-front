/// <reference path="./typings/app.d.ts" />

import {Component, bootstrap, provide, FORM_DIRECTIVES, CORE_DIRECTIVES, Injectable, View} from 'angular2/angular2'
import {Http, HTTP_PROVIDERS, HTTP_BINDINGS} from 'angular2/http'
import {ROUTER_BINDINGS, LocationStrategy} from 'angular2/router'
import {ROUTER_DIRECTIVES, RouteConfig, RouterOutlet, Router, RouterLink, AsyncRoute, Location} from 'angular2/router'
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
  // { path:"/panel", component: Panel, as:"Panel"},
  new AsyncRoute({
    path: '/panel',
    loader: () => System.import('build/app/components/private/panel').then(m => m.Panel),
    name: 'Panel'
  })
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
      //host:"http://127.0.0.1:8088"
      //host:"https://transpoint.herokuapp.com"
      host:"http://104.155.71.69"
    })
  }}),
  provide(AuthHttp, { useFactory: () => {
    return new AuthHttp({
      tokenName: "jwt",
      //host:"http://127.0.0.1:8088"
      //host:"https://transpoint.herokuapp.com"
      host:"http://104.155.71.69"
    })
  }})
]);
