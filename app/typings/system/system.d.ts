
declare class SystemPromise{
  then(init?:Function): Function
}
declare class System {
  static import(path: string): SystemPromise;
}
