import { ILifeCycle, IInternalAppInfo, AppStatus, IAppInfo } from "../declare/index";
import { loadHTML } from '../loader'


let lifeCycle: ILifeCycle = {};

export const setLifeCycle = (list: ILifeCycle) => {
  lifeCycle = list;
};

export const getLifeCycle = () => {
  return lifeCycle;
};

const runLifeCycle = async (name: keyof ILifeCycle, app: IAppInfo) => {
  const fn = lifeCycle[name];
  if (fn instanceof Array) {
    await Promise.all(fn.map((item) => item(app)));
  } else {
    await fn?.(app);
  }
};

export const runBeforeLoad = async (app: IInternalAppInfo) => {
  app.status = AppStatus.LOADING;
  await runLifeCycle('beforeLoad', app)
  app = await loadHTML(app)
  app.status = AppStatus.LOADED
};
