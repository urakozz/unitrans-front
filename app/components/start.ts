import {Component, View} from "angular2/angular2"


@Component({
    selector: 'start'
})
@View({
    template: `
    <h1></h1><p>
    <div class="row">
      <div class="col-md-12">
        <div class="bs-component">
          <div class="jumbotron">
            <h1>Unitrans</h1>

            <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>

            <p><a class="btn btn-material-indigo btn-lg">Learn more</a></p>
          </div>
        <div id="source-button" class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div></div>
      </div>
    </div>
    <p>
    <p>

    <h1></h1>
<h1>Key Features</h1>
<div class="row Grid Grid--flexCells">

  <div class="col-xs-12 col-md-4 Grid-cell">
    <div class="panel panel-default width100">
      <div class="panel-heading panel-material-indigo well-material-ingigo">Panel heading without title</div>
      <div class="panel-body">
        Basic panel example<p><p>
        ddd</p></p>67
      </div>
    </div>
  </div>

<div class="col-xs-12 col-md-4 Grid-cell">
  <div class="panel panel-default width100">
  <div class="panel-heading">Panel heading without title</div>
  <div class="panel-body">
    Basic panel example
    <p>
  </div>
</div>
</div>

<div class="col-xs-12 col-md-4 Grid-cell">
<div class="panel panel-default width100">
<div class="panel-heading">Panel heading without title</div>
  <div class="panel-body">
    Basic panel example
  </div>
</div></div>
</div>
    `
})
export class Start {
    token: string
    constructor() {
      this.token = localStorage.getItem("jwt")
    }
}
