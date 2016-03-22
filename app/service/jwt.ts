import {Injectable, Inject} from 'angular2/core';

import {Http, HTTP_PROVIDERS, Headers, BaseRequestOptions, Request, Response, RequestOptions, RequestOptionsArgs, RequestMethod} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

//let {Observable} = Rx;

/**
 * Sets up the authentication configuration.
 */

export class AuthConfig {

  config: any;
  headerName: string;
  headerPrefix: string;
  tokenName: string;
  host: string;

  constructor(config?:any) {
    this.config = config || {};
    this.headerName = this.config.headerName || 'Authorization';
    this.headerPrefix = this.config.headerPrefix || 'Bearer ';
    this.tokenName = this.config.tokenName || 'id_token';
    this.host = this.config.host || "http://localhost:8088"
  }

}

/**
 * Allows for explicit authenticated HTTP requests.
 */

@Injectable()
export class AuthHttp {

  private _config: AuthConfig;

  constructor(private http: Http, @Inject('API_ROOT') private host: string, @Inject('TOKEN_NAME') token: string) {
    this._config = new AuthConfig({host:host, tokenName:token});

    //var obs = new Rx.Observable()
  }

  request(method:RequestMethod, url:string, body?:string): Observable<Response> {

    if(this.getJwt() === null || this.getJwt() === undefined || this.getJwt() === '') {
      throw 'No JWT Saved';
    }

    var authHeader = new Headers();
    authHeader.append(this._config.headerName, this._config.headerPrefix + this.getJwt());
    console.log(authHeader)
    return this.http.request(new Request(new RequestOptions({method: method,
      url: url,
      body: body,
      headers: authHeader
    })));

  }

  getJwt() {
    return localStorage.getItem(this._config.tokenName);
  }

  get(url:string): Observable<Response> {
    return this.request(RequestMethod.Get, this._config.host + url);
  }

  post(url:string, body:string): Observable<Response>{
    return this.request(RequestMethod.Post, this._config.host + url, body);
  }

  put(url:string, body:string): Observable<Response> {
    return this.request(RequestMethod.Put, this._config.host + url, body);
  }

  delete(url:string, body?:string): Observable<Response> {
    return this.request(RequestMethod.Delete, this._config.host + url, body);
  }

  options(url:string, body?:string): Observable<Response> {
    return this.request(RequestMethod.Options, this._config.host + url, body);
  }

  head(url:string, body?:string): Observable<Response> {
    return this.request(RequestMethod.Head, this._config.host + url, body);
  }

  patch(url:string, body:string): Observable<Response> {
    return this.request(RequestMethod.Patch, this._config.host + url, body);
  }

}
