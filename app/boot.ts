import {bootstrap}    from 'angular2/platform/browser'
import {provide} from 'angular2/core'
import {AppComponent} from './app'
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {ROUTER_PROVIDERS} from 'angular2/router'
import {HTTP_PROVIDERS} from 'angular2/http'
import {MATERIAL_PROVIDERS} from 'ng2-material/all';


bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  MATERIAL_PROVIDERS,
  provide('API_ROOT', {useValue: "https://transpoint.herokuapp.com"}),
  provide('TOKEN_NAME', {useValue: "jwt"}),
  provide(UserService, { useClass: UserService}),
  provide(AuthHttp, { useClass: AuthHttp})
]).catch((err: any) => console.log(err));
