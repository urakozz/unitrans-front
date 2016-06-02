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
      .subscribe(d => {this.directions = d})
  }

  getDirections(){
    return this.directions
  }

  lookup(text:string, from: string, to:string):Observable<Object>{
    let params = this._getParams()
    let lang = from+"-"+to
    if(!text){
      return Observable.of(undefined)
    }
    if (text.split(" ").length > 3){
      return Observable.of(undefined)
    }
    if(this.directions.indexOf(lang) === -1){
      return Observable.of(undefined)
    }
    params.append("lang", lang)
    params.append("text", text)

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
