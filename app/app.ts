import{ FORM_DIRECTIVES, CORE_DIRECTIVES} from "angular2/common"
import {Component, Injectable} from 'angular2/core'
import {Http, JSONP_PROVIDERS} from 'angular2/http'
import {LocationStrategy} from 'angular2/router'
import {ROUTER_DIRECTIVES, RouteConfig, RouterOutlet, Router, RouterLink, AsyncRoute, Location} from 'angular2/router'
import {LoggedInRouterOutlet} from './utils/routerOutlet';
// import {FirebaseRef as firebase} from './service/firebase'
import {Hero} from "./service/hero/hero"
import {HeroService} from "./service/hero-service"
import {Logger} from "./service/logger"
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {Dictionary} from './service/dictionary'
import {Start} from "./components/start"
import {List} from "./components/list"
import {Login} from "./components/login"
import {Signup} from "./components/signup"

import {Panel} from "./components/private/panel"
import {MATERIAL_DIRECTIVES} from "ng2-material/all";
import {enableProdMode} from 'angular2/core';
if((<any>window).__production) {
  enableProdMode()
}

@Component({
  selector: 'unitrans-app',
  directives: [CORE_DIRECTIVES,LoggedInRouterOutlet,RouterLink,MATERIAL_DIRECTIVES],
  providers:[JSONP_PROVIDERS, Dictionary],
  templateUrl:"app/app.html"
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
    showMenu = false;

    constructor(public userService: UserService, public router: Router) {
      this._clearInitLoadAnimation()
      // console.log("app user in", userService.in)
      window.fetch(userService.getHost()).then(res => console.log(res)).catch(()=>{console.log("^^^ Do not worry, I'm weared")})
    }

    logout(){
      this.userService.logout()
      this.router.navigate(["Start"])
    }

    _clearInitLoadAnimation(){
      let w = <any>window
      if(w.initLoadAnimation){
        clearInterval(w.initLoadAnimation)
        w.initLoadAnimation = undefined
      }
    }

}
