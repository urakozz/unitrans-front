/// <reference path="../typings/index.d.ts" />
import {bootstrap}    from '@angular/platform-browser-dynamic'
import {provide} from '@angular/core'
import {AppComponent} from './app'
import {AuthHttp} from './service/jwt'
import {UserService} from './service/user'
import {ROUTER_PROVIDERS} from '@angular/router'
import {HTTP_PROVIDERS} from '@angular/http'
import {MATERIAL_PROVIDERS} from 'ng2-material'
import 'rxjs/Rx';


bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  MATERIAL_PROVIDERS,
  provide('API_ROOT', {useValue: "https://unitransapi.herokuapp.com"}),
  provide('DICT_ROOT', {useValue: "https://dictionary.yandex.net/api/v1/dicservice.json"}),
  provide('DICT_KEY', {useValue: "dict.1.1.20160421T110845Z.df302dd7520b71c5.01ed5642ec02ec127ae047545eedbe517f1eaabe"}),
  provide('TOKEN_NAME', {useValue: "jwt"}),
  provide(UserService, { useClass: UserService}),
  provide(AuthHttp, { useClass: AuthHttp})
]).catch((err: any) => console.log(err));
