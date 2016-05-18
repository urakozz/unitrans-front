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
    private clip: ZC.ZeroClipboardClient;

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
      //ZeroClipboard.config({"swfPath":"https://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf"})
      //this.clip = new ZeroClipboard()
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
          term = term.trim()
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

    get translationUni(){
      if (!this.processedData || !this.processedData.RawTransData[this.selectedLang.code]){
        return {}
      }
      let translations = this.processedData.RawTransData[this.selectedLang.code]
      return translations["uni"]
    }

    get processedDetails(){
      if (!this.processedData || !this.processedData.RawTransData[this.selectedLang.code]){
        return []
      }
      let list = []
      let translations = this.processedData.RawTransData[this.selectedLang.code]
      Object.keys(translations).forEach(k => {
        let tr = translations[k]
        if (k !== "uni") {
          list.push(tr)
        }
      })
      return list
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

    copy(e, ti){
      console.log(e, ti.value)
      ti.select()
      // this.clip.setText("text")
      // console.log(this.clip)
      try {
        // copy text
        document.execCommand('copy');
        ti.blur();
      } catch (err) {
        console.error(err)
        alert('please press Ctrl/Cmd+C to copy');
      }
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
