import {Component, View} from "angular2/core"
import {Control, ControlGroup} from "angular2/common"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {Http, Headers, Request, Response, RequestOptions, RequestMethod} from "angular2/http"
import {TimerWrapper} from 'angular2/src/facade/async'

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

import {Lang} from '../models/lang';
import {AutogrowDirective} from '../directives/textarea'

@Component({
    selector: 'start'
})
@View({
    templateUrl: "app/components/start.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, AutogrowDirective]
})
export class Start {
    token: string;
    selectedLang: Lang;
    languages: Lang[];
    sourceText: string;
    processedData: any;
    formGroup: ControlGroup = new ControlGroup({
      source: new Control()
    });
    private timeoutId: number;

    constructor(public http: Http) {
      this.token = localStorage.getItem("jwt")
      this.formGroup.valueChanges.subscribe((values) => {
        this.asyncTranslator(values.source)
      });
      this.languages = [
        { "code":"en", "title":"English"},
        { "code":"ru", "title":"Russian"},
        { "code":"de", "title":"German"}
      ]
      this.initLang()
    }

    private initLang(){

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

    get processedText(){
      return JSON.stringify(this.processedData, null, 2)
    }

    get processedList(){
      return this.processedData.RawTransData
    }

    selectLang(lang: Lang) {
      console.log(lang)
      this.selectedLang = lang
      localStorage.setItem("lang", lang.code)
      this.translateForce()
    }

    translateForce(){
      this.asyncTranslator(this.sourceText)
    }

    private asyncTranslator(value: string) {
      if (!value){
        this.processedData = undefined
        return
      }
        if (this.timeoutId) {
          TimerWrapper.clearTimeout(this.timeoutId)
        }
        // this.timeoutId = TimerWrapper.setTimeout(() => {
        //   console.log("tick", value)
        //   console.log("this = ", this)
        // }, 250);
        this.timeoutId = TimerWrapper.setTimeout(() => {
          var authHeader = new Headers();
          // authHeader.append("X-Auth-Key", "12578502236444961733.a18f3ef1");
          var request = this.http.request(new Request(new RequestOptions({
            method: RequestMethod.Post,
            url: "https://transpoint.herokuapp.com/webapi/tr",
            //url: "http://127.0.0.1:8088/webapi/tr",
            body: JSON.stringify({text:this.sourceText, lang:[this.selectedLang.code]}),
            headers: authHeader
          })));

          request
            .subscribe(
              (data) => {
                data = data.json()
                console.log("success", data)
                if (this.sourceText) {
                  this.processedData = data
                }
              },
              (err) => { console.log("error", err)},
              () => {console.log("done with request")}
          )
        }, 200);
    }
}
