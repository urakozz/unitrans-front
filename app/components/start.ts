import {Component, ElementRef, Input, Output, EventEmitter} from "angular2/core"
import {Control, ControlGroup} from "angular2/common"
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from 'angular2/common'
import {Http, Headers, Request, Response, RequestOptions, RequestMethod} from "angular2/http"
import {TimerWrapper} from 'angular2/src/facade/async'

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject'

import {Lang, LANGS} from '../models/lang';
import {AutogrowDirective} from '../directives/textarea'
import {Dictionary} from "../service/dictionary";

import {MATERIAL_DIRECTIVES, MdDialog, Media, MdDialogConfig, MdDialogBasic, MdDialogRef} from "ng2-material/all";

@Component({
    selector: 'start',
    templateUrl: "app/components/start.html",
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES, AutogrowDirective,MATERIAL_DIRECTIVES]
})
export class Start {
    private token: string;
    public selectedLang: Lang;
    private languages: Lang[] ;
    public languagesAll: Lang[] = LANGS;
    public sourceText: string;
    public processedData: any;
    private _searchTermStream = new Subject<string>();
    private _langStream = new Subject<Lang>();
    // private clip: ZC.ZeroClipboardClient;
    private _justCopied: boolean;
    private _recognition: boolean;
    private speech:any;
    public status:string

    // formGroup: ControlGroup = new ControlGroup({
    //   source: new Control()
    // });

    constructor(
      public http: Http,
      public dialog: MdDialog,
      public media: Media,
      protected element: ElementRef,
      protected dict: Dictionary) {
      this.token = localStorage.getItem("jwt")
      // this.formGroup.valueChanges.subscribe((values) => {
      //   this.asyncTranslator(values.source)
      // });

      this.languages = this.languagesAll.filter(l => !!~["en", "ru"].indexOf(l.code))
      this.initLang()
      this.initStream()
      this.initLangStreamSubscribe()
      this.initSpeechKit()
      //ZeroClipboard.config({"swfPath":"https://cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf"})
      //this.clip = new ZeroClipboard()
      }

    private initLang(): void{

      let code = localStorage.getItem("lang")
      if (!code) {
        code = this.languages[0].code
      }
      this.languagesAll.forEach((lang:Lang) => {
        if (lang.code === code) {
          this._doSelectLang(lang)
        }
      })
    }

    private initLangStreamSubscribe(): void{
      this._langStream
        .distinctUntilChanged()
        .subscribe((l:Lang) => {
          this._doSelectLang(l)
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
          this.processedData = data
        }, err =>{
          console.error("translation stream error:" , err)
        })
    }

    initSpeechKit(){
      let w = <any>window
      w.ya.speechkit.settings.apikey = '38677360-f6ae-4ad0-8482-962928d0f026'
      w.ya.speechkit.audiocontext = new (w.AudioContext || w.webkitAudioContext)();
      this.speech = new w.ya.speechkit.SpeechRecognition();
      // var textline = new w.ya.speechkit.Textline('my_id', {
      //       apikey: '38677360-f6ae-4ad0-8482-962928d0f026',
      //       onInputFinished: function(text) {
      //           this.sourceText=text
      //       }
      //   });
    }

    get isRecognitionSupported(){
      let w = <any>window
      return w.ya.speechkit.isSupported()
    }

    recognizeSpeech(): void{
      if(this._recognition){
        this.speech.stop();
        return
      }
      this._recognition = true
      // w.ya.speechkit.recognize({
      //     // Функция будет вызвана, когда распознавание завершится.
      //     doneCallback: (text)=>{
      //         console.log("Финальный результат распознавания: " + text);
      //         this._recognition = false
      //         this.sourceText = text
      //     },
      //     // Функция вызовется, как только сессия будет инициализирована.
      //     initCallback: ()=>{
      //       this._recognition = true
      //          console.log("Процесс распознавания запущен.");
      //
      //     },
      //     // Вызывается в случае возникновения ошибки.
      //     errorCallback: (err) => {
      //          console.log("Возникла ошибка: " + err);
      //          this._recognition = false
      //     },
      //     // Длительность промежутка тишины, при наступлении которой
      //     // распознавание завершается.
      //     utteranceSilence: 60
      //
      // });

      this.speech.start({
          // Вызывается после успешной инициализации сессии.
          initCallback: ()=>{
              console.log("Началась запись звука.");
          },
          // Данная функция вызывается многократно.
          // Ей передаются промежуточные результаты распознавания.
          // После остановки распознавания этой функции
          // будет передан финальный результат.
          dataCallback: (text, done, merge, time) => {
              console.log("Распознанный текст: " + text);
              console.log("Является ли результат финальным:" + done);
              console.log("Число обработанных запросов, по которым выдан ответ от сервера: " + merge);
              console.log("Время начала и конца распознанного фрагмента речи: " + time);

              this.sourceText = text
              this.asyncTranslator()
          },
          // Вызывается при возникновении ошибки (например, если передан неверный API-ключ).
          errorCallback: (err) => {
              console.log("Возникла ошибка: " + err);
              this._recognition = false
          },
          // Содержит сведения о ходе процесса распознавания.
          infoCallback: (info) => {
              console.log("Отправлено данных на сервер: " , info.sent_bytes);
              console.log("Отправлено пакетов на сервер: " , info.packages);
              console.log("Количество пакетов, которые обработал сервер: " + info.processed);
              console.log("До какой частоты понижена частота дискретизации звука: " + info.format);
          },
          // Будет вызвана после остановки распознавания.
          stopCallback: ()=> {
              console.log("Запись звука прекращена.");
              this._recognition = false
          },
          // Возвращать ли промежуточные результаты.
          particialResults: true,
          // Длительность промежутка тишины (в сантисекундах),
          // при наступлении которой API начнет преобразование
          // промежуточных результатов в финальный текст.
          utteranceSilence: 60
      });
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

    asyncSelectLang(lang: Lang): void {
      this._langStream.next(lang)
    }

    _doSelectLang(lang: Lang): void {
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

    asyncTranslator(): void {
      this._searchTermStream.next(this.sourceText)
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
        this.justCopied()
      } catch (err) {
        console.error(err)
        alert('please press Ctrl/Cmd+C to copy');
      }
    }

    justCopied(){
      this._justCopied = true
      Observable.of(false).delay(500).subscribe(b => {
        this._justCopied = b
      })
    }

    showAdvanced(ev) {
      let config = new CustomDialogConfig()
        .lang(this.selectedLang, this.languagesAll, this._langStream)
        .targetEvent(ev);
      this.dialog.open(DialogCustom, this.element, config)
        .then((ref: MdDialogRef) => {
          // ref.whenClosed.then((lang:Lang) => {
          //   lang && this.asyncSelectLang(lang)
          //   console.log("set lang")
          // })
        });
    }

    private doRequest(value: string): Observable<Object>{
      let authHeader = new Headers();
      return this.http.request(new Request(new RequestOptions({
        method: RequestMethod.Post,
        url: "https://unitransapi.herokuapp.com/webapi/tr",
        //url: "http://127.0.0.1:8088/webapi/tr",
        body: JSON.stringify({text:value, lang:[this.selectedLang.code]}),
        headers: authHeader
      }))).map(req => <Object>req.json());
    }
}


class CustomDialogConfig extends MdDialogConfig {
    lang(lang: Lang, languages:Lang[], langStream:Subject<Lang>):MdDialogConfig {
        this.context.lang = lang;
        this.context.languages = languages;
        this.context.langStream = langStream;
        return this;
    }
}

@Component({
  selector: 'dialog-custom',
  template: `
    <div layout="column" layout-align="center center">
      <!-- <button md-button class="md-padding"
        *ngFor="#_lang of languages"
        (click)=selectLang(_lang)
        class="md-raised"
        [class.md-primary]="_lang.code === lang.code">{{_lang.title}}</button> -->
        <span>Select language:</span>
        <md-input-container>
          <select (change)="selectLangCode($event.target.value)">
            <option *ngFor="#_lang of languages" [value]="_lang.code" [selected]="_lang.code === lang.code">
              {{_lang.title}}
            </option>
          </select>
        </md-input-container>
          <button md-button (click)="dialog.close(null)">
            <span>Dismiss</span>
          </button>
    </div>
  `,
  styles: [``],
  directives: [MATERIAL_DIRECTIVES]
})
class DialogCustom {
  @Input() lang: Lang;
  @Input() languages: Lang[]
  @Input() langStream:Subject<Lang>

  constructor(private dialog: MdDialogRef) {

  }

  selectLang(lang: Lang){
    this.lang=lang
    this.dialog.close(lang)
  }
  selectLangCode(l: string){
    this.languages.forEach(i => {
      if (i.code == l){
        this.lang=i
        this.langStream.next(i)
      }
    })

    this.dialog.close(this.lang)
  }
}
