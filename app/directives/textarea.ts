import {Directive} from "@angular/core"

@Directive({
  selector: 'textarea[autogrow]',
  host: {
    '(input)': 'onInput(\$event.target)'
  }
})
export class AutogrowDirective {
   onInput(textArea) {
     // shrink the textarea when needed
     textArea.style.height = 'auto';

     // set the height to scrollHeight minus some correction
     let correction = textArea.offsetHeight - textArea.clientHeight;
     let h = textArea.scrollHeight - correction
     textArea.style.height = h +'px';
   }
}
