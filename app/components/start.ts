import {Component, View, Control, ControlGroup} from "angular2/angular2"
import {Http, Headers, Request, Response, RequestOptions, RequestMethods} from "angular2/http"
import {TimerWrapper, NodeJS} from 'angular2/src/facade/async'

@Component({
    selector: 'start'
})
@View({
    template: `
          <div class="well" style="">
            <h1>Unitrans</h1>

            <p>Try out translation across multiple translatiors right here</p>
            <div class="row Grid Grid--flexCells" style="margin-top:5rem">

                <div class="col-xs-12 col-md-6 Grid-cell">
                    <form class="width100" [ng-form-model]="formGroup">
                      <div class="form-group form-group-material-amber">
                        <textarea class="form-control" rows="1" [(ng-model)]="sourceText" ng-control="source" placeholder="Type text here"></textarea>
                      </div>
                    </form>
                </div>
              <div class="col-xs-12 col-md-6 Grid-cell">
                <div *ng-if="sourceText && !processedData" >
                  <i class="fa fa-circle-o-notch fa-spin"></i>
                </div>

                <div *ng-if="processedData" class="width100">
                  <div class="panel">
                    <div class="well well-sm well-material-amber shadow-z-0 margin-bottom-none">
                      Source: <b>{{processedData.Source}}</b>
                    </div>
                    <div class="panel-body">
                      {{processedData.Original}}
                    </div>
                  </div>
                  <div class="panel" *ng-for="#item of processedList">
                    <div class="well well-sm well-material-indigo shadow-z-0 margin-bottom-none">
                      <span class="text-white">{{item.Name}} [{{item.Source || "?"}}-{{item.Lang}}] {{item.Time}} ms </span>
                    </div>
                    <div class="panel-body">
                      {{item.Translation}}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12">
                <pre *ng-if="processedData" class="width100">{{processedText}}</pre>
              </div>
            </div>
            <p>
              <span class="btn btn-material-indigo btn-lg" (click)="translateForce()">Translate</span>
            </p>
    </div>

  <div class="row">
      <h1 class="header__padding">Key Features</h1>
  </div>
<div class="row Grid Grid--flexCells">

  <div class="col-xs-12 col-md-4 Grid-cell">
    <div class="panel panel-default width100">
      <div class="panel-heading-material-indigo">Panel heading without title</div>
      <div class="panel-body">
        Basic panel example<p><p>
        ddd</p></p>67
      </div>
    </div>
  </div>

<div class="col-xs-12 col-md-4 Grid-cell">
  <div class="panel panel-default width100">
  <div class="panel-heading-material-indigo">Panel heading without title</div>
  <div class="panel-body">
    Basic panel example
    <p>
  </div>
</div>
</div>

<div class="col-xs-12 col-md-4 Grid-cell">
<div class="panel panel-default width100">
<div class="panel-heading-material-indigo">Panel heading without title</div>
  <div class="panel-body">
    Basic panel example
  </div>
</div></div>
</div>
    `
})
export class Start {
    token: string
    sourceText: string
    processedData: any
    formGroup: ControlGroup = new ControlGroup({
      source: new Control()
    })
    private timeoutId: NodeJS.Timer

    constructor(public http: Http) {
      this.token = localStorage.getItem("jwt")
      this.formGroup.valueChanges.subscribe((values) => {
        this.asyncTranslator(values.source)
      });
    }

    get processedText(){
      return JSON.stringify(this.processedData, null, 2)
    }

    get processedList(){
      return this.processedData.RawTransData
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
            method: RequestMethods.Post,
            url: "https://transpoint.herokuapp.com",
            body: JSON.stringify({text:this.sourceText, lang:["ru"]}),
            headers: authHeader
          })));

          request
            .map((res: Response) => res.json())
            .subscribe(
              (data) => {
                console.log("success", data)
                if (this.sourceText) {
                  this.processedData = data
                }
              },
              (err) => { console.log("error", err)},
              () => {console.log("done with request")}
          )
        }, 250);
    }
}
