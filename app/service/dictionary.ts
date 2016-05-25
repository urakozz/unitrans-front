import {Injectable, Inject} from "angular2/core"
import {Http, Jsonp, Response, URLSearchParams} from 'angular2/http'
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Dictionary{

  private directions:string[]

  constructor(
    @Inject('DICT_ROOT') private host: string,
    @Inject('DICT_KEY') private key: string,
    private jsonp: Jsonp
  ){
    this.initLangs()
  }

  initLangs(){
    return this.jsonp.get(this.host + "/getLangs", {search:this._getParams()})
      .map((res:Response) => res.json())
      .subscribe(d => this.directions)
  }

  lookup(text:string, from: string, to:string):Observable<Object>{
    let params = this._getParams()
    if(this.directions.indexOf(from+"-"+to) > -1){
      return Observable.empty()
    }
    return this.jsonp.get(this.host + "/lookup", {search:params})
      .map((res:Response) => res.json())
  }

  _getParams(): URLSearchParams {
    let params = new URLSearchParams()
    params.append("callback","JSONP_CALLBACK")
    params.append("key", this.key)
    return params
  }
}
