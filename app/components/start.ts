import {Component} from "angular2/core"
import {Control, ControlGroup} from "angular2/common"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {Http, Headers, Request, Response, RequestOptions, RequestMethod} from "angular2/http"
import {TimerWrapper} from 'angular2/src/facade/async'

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject'

import {Lang} from '../models/lang';
import {AutogrowDirective} from '../directives/textarea'
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

@Component({
    selector: 'start',
    templateUrl: "app/components/start.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, AutogrowDirective,MATERIAL_DIRECTIVES]
})
export class Start {
    token: string;
    selectedLang: Lang;
    languages: Lang[];
    sourceText: string;
    processedData: any;
    private _searchTermStream = new Subject<string>();
    // formGroup: ControlGroup = new ControlGroup({
    //   source: new Control()
    // });

    constructor(public http: Http) {
      this.token = localStorage.getItem("jwt")
      // this.formGroup.valueChanges.subscribe((values) => {
      //   this.asyncTranslator(values.source)
      // });
      this.languages = [
        { "code":"en", "title":"English"},
        { "code":"ru", "title":"Russian"},
        { "code":"de", "title":"German"}
      ]
      this.initLang()
      this.initStream()
    }

    private initLang(): void{

      let code = localStorage.getItem("lang")
      if (!code) {
        code = this.languages[0].code
      }
      this.languages.forEach((lang:Lang) => {
        if (lang.code === code) {
          this.selectLang(lang)
        }
      })
    }

    private initStream(): void{
      this._searchTermStream
        .debounceTime(200)
        .distinctUntilChanged()
        .switchMap((term:string) => {
          if(!term){
            this.processedData = undefined
            return Observable.empty()
          }
          return this.doRequest(term)
        })
        .subscribe(data => {
          console.log("subs",data)
          this.processedData = data
        }, err =>{
          console.error("translation stream error:" , err)
        })
    }

    get processedText(){
      return JSON.stringify(this.processedData, null, 2)
    }

    get processedList(){
      return this.processedData.RawTransData
    }

    selectLang(lang: Lang): void {
      this.selectedLang = lang
      localStorage.setItem("lang", lang.code)
      this.translateForce()
    }

    translateForce(): void {
      if (!this.sourceText){
        this.processedData = undefined
        return
      }
      this.doRequest(this.sourceText).subscribe(data => this.processedData = data)
    }

    asyncTranslator(term:string): void {
      this._searchTermStream.next(term)
    }

    private doRequest(value: string): Observable<Object>{
      let authHeader = new Headers();
      return this.http.request(new Request(new RequestOptions({
        method: RequestMethod.Post,
        url: "https://transpoint.herokuapp.com/webapi/tr",
        //url: "http://127.0.0.1:8088/webapi/tr",
        body: JSON.stringify({text:value, lang:[this.selectedLang.code]}),
        headers: authHeader
      }))).map(req => <Object>req.json());
    }
}
