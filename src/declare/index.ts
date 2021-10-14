export enum AppStatus {
  NOT_LOADED = "NOT_LOADED",
  LOADING = "LOADING",
  LOADED = "LOADED",
  BOOTSTRAPPING = "BOOTSTRAPPING",
  NOT_MOUNTED = "NOT_MOUNTED",
  MOUNTING = "MOUNTING",
  MOUNTED = "MOUNTED",
  UNMOUNTING = "UNMOUNTING",
}

export type LifeCycle = (app: IAppInfo) => Promise<any>;

export type EventType = "hashchange" | "popstate";

export interface IAppInfo {
  name: string;
  entry: string;
  container: string;
  activeRule: string;
}

export interface IInternalAppInfo extends IAppInfo {
  status: AppStatus;
  bootstrap?: LifeCycle;
  mount?: LifeCycle;
  unmount?: LifeCycle;
  proxy: any;
}

export interface ILifeCycle {
    beforeLoad?: LifeCycle | LifeCycle[]
    mounted?: LifeCycle | LifeCycle[]
    unmounted?: LifeCycle | LifeCycle[]
  }