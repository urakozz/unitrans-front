import {Directive, Attribute, ElementRef, DynamicComponentLoader} from '@angular/core';
import {Router, RouterOutletMap} from '@angular/router';
// 
// @Directive({
//   selector: 'router-outlet'
// })
// export class LoggedInRouterOutlet extends RouterOutletMap {
//   publicRoutes:any;
//   private parentRouter:Router;
//
//   constructor(_elementRef:ElementRef, _loader:DynamicComponentLoader,
//               _parentRouter:Router, @Attribute('name') nameAttr:string) {
//     super(_elementRef, _loader, _parentRouter, nameAttr);
//
//     this.parentRouter = _parentRouter;
//     this.publicRoutes = {
//       'login': true,
//       'signup': true
//     };
//   }
//
//   activate(instruction: ComponentInstruction) {
//     var url = instruction.urlPath
//     console.log(url)
//     if (url && !this.publicRoutes[url] && !localStorage.getItem('jwt')) {
//       // todo: redirect to Login, may be there a better way?
//       console.log("Unauthorized, redirect", url, instruction)
//       this.parentRouter.navigateByUrl('/login');
//     }
//     return super.activate(instruction);
//   }
// }
