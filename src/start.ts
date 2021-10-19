import { IAppInfo, ILifeCycle, IInternalAppInfo, AppStatus } from "./declare";
import { setLifeCycle } from "./lifeCycle";
import { getAppList, setAppList } from "./appList/index";
import { hijackRoute, reroute } from "./route";
import { prefetch } from './utils'

export const registerMicroApps = (appList: IAppInfo[], lifeCycle?: ILifeCycle) => {
  setAppList(appList);
  lifeCycle && setLifeCycle(lifeCycle);
};

export const start = () => {
  const list = getAppList();

  if (!list.length) {
    throw new Error("请先注册应用");
  }

  hijackRoute();
  reroute(window.location.href);

  list.forEach((app) => {
    if ((app as IInternalAppInfo).status === AppStatus.NOT_LOADED) {
      prefetch(app as IInternalAppInfo)
    }
  });
};
