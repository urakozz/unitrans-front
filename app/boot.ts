import {bootstrap}    from 'angular2/platform/browser'
import {provide} from 'angular2/core'
import {AppComponent} from './app'
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {ROUTER_PROVIDERS} from 'angular2/router'
import {Http, HTTP_PROVIDERS} from 'angular2/http'


bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(UserService, { useFactory: () => {
    return new UserService({
      //host:"http://127.0.0.1:8088"
      host:"https://transpoint.herokuapp.com"
    })
  }}),
  provide(AuthHttp, { useFactory: () => {
    return new AuthHttp({
      tokenName: "jwt",
      //host:"http://127.0.0.1:8088"
      host:"https://transpoint.herokuapp.com"
    })
  }})
]);
