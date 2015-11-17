import {Injectable} from 'angular2/core';

@Injectable()
export class Logger {
  log(msg:string) {
    console.log(msg)
  }
}
