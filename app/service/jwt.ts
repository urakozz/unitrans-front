import {Injectable, Injector} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Headers, BaseRequestOptions, Request, RequestOptions, RequestOptionsArgs, RequestMethods} from 'angular2/http';

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
  http: Http;

  constructor(config?:Object) {
    this._config = new AuthConfig(config);
    var injector = Injector.resolveAndCreate([HTTP_PROVIDERS]);
    this.http = injector.get(Http);

    //var obs = new Rx.Observable()
  }

  request(method:RequestMethods, url:string, body?:string) {

    if(this.getJwt() === null || this.getJwt() === undefined || this.getJwt() === '') {
      throw 'No JWT Saved';
    }

    var authHeader = new Headers();
    authHeader.append(this._config.headerName, this._config.headerPrefix + this.getJwt());
    return this.http.request(new Request(new RequestOptions({method: method,
      url: url,
      body: body,
      headers: authHeader
    })));

  }

  getJwt() {
    return localStorage.getItem(this._config.tokenName);
  }

  get(url:string) {
    return this.request(RequestMethods.Get, this._config.host + url);
  }

  post(url:string, body:string) {
    return this.request(RequestMethods.Post, this._config.host + url, body);
  }

  put(url:string, body:string) {
    return this.request(RequestMethods.Put, this._config.host + url, body);
  }

  delete(url:string, body?:string) {
    return this.request(RequestMethods.Delete, this._config.host + url, body);
  }

  options(url:string, body?:string) {
    return this.request(RequestMethods.Options, this._config.host + url, body);
  }

  head(url:string, body?:string) {
    return this.request(RequestMethods.Head, this._config.host + url, body);
  }

  patch(url:string, body:string) {
    return this.request(RequestMethods.Patch, this._config.host + url, body);
  }

}
