/// <reference path="./typings/app.d.ts" />
import{ FORM_DIRECTIVES, CORE_DIRECTIVES} from "angular2/common"
import {Component, Injectable} from 'angular2/core'
import {Http} from 'angular2/http'
import {LocationStrategy} from 'angular2/router'
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
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

//
// firebase.child("messages").on("value", function(snapshot) {
//   console.log(snapshot.val());  // Alerts "San Francisco"
// });
@Component({
    selector: 'unitrans-app',
  directives: [CORE_DIRECTIVES,LoggedInRouterOutlet,RouterLink,MATERIAL_DIRECTIVES],
  templateUrl:"templates/app_main.html"
})
@RouteConfig([
  { path: '/', component: Start, as:"Start" },
  { path:"/list", component: List, as:"List"},
  { path:"/login", component: Login, as:"Login"},
  { path:"/signup", component: Signup, as:"Signup"},
  { path:"/panel", component: Panel, as:"Panel"},
  // new AsyncRoute({
  //   path: '/panel',
  //   loader: () => System.import('build/app/components/private/panel').then(m => m.Panel),
  //   name: 'Panel'
  // })
])
export class AppComponent {

    constructor(public userService: UserService, public router: Router) {
      console.log("app user in", userService.in)
      window.fetch(userService.getHost()).then(res => console.log(res)).catch(()=>{console.log("^^^ Do not worry, I'm weared")})
    }

    logout(){
      this.userService.logout()
      this.router.navigateByUrl('/')
    }

}
