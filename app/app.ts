import{ FORM_DIRECTIVES, CORE_DIRECTIVES} from "@angular/common"
import {Component, Injectable} from '@angular/core'
import {Http, JSONP_PROVIDERS} from '@angular/http'
//import {ROUTER_DIRECTIVES, RouteConfig, RouterOutlet, Router, RouterLink, Location} from '@angular/router'
//import {LoggedInRouterOutlet} from './utils/routerOutlet';
import {
  ROUTER_DIRECTIVES,
  ROUTER_PROVIDERS,
  Router,
  Routes
} from '@angular/router';
// import {FirebaseRef as firebase} from './service/firebase'
import {Hero} from "./service/hero/hero"
import {HeroService} from "./service/hero-service"
import {Logger} from "./service/logger"
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {Dictionary} from './service/dictionary'
import {Start} from "./components/start"
import {Login} from "./components/login"
import {Signup} from "./components/signup"

import {Panel} from "./components/private/panel"
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {enableProdMode} from '@angular/core';
if((<any>window).__production) {
  enableProdMode()
}

@Component({
  selector: 'unitrans-app',
  directives: [CORE_DIRECTIVES,ROUTER_DIRECTIVES,MATERIAL_DIRECTIVES,MdToolbar],
  providers: [JSONP_PROVIDERS, Dictionary, MATERIAL_PROVIDERS],
  templateUrl:"app/app.html"
})
@Routes([
  { path: '/', component: Start},
  { path:"/login", component: Login},
  { path:"/signup", component: Signup},
  { path:"/panel", component: Panel},
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
      this.router.navigate(["/"])
    }

    _clearInitLoadAnimation(){
      let w = <any>window
      if(w.initLoadAnimation){
        clearInterval(w.initLoadAnimation)
        w.initLoadAnimation = undefined
      }
    }

}
