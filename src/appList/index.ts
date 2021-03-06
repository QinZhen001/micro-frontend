import { IAppInfo, IInternalAppInfo, AppStatus } from "../declare";

let appList: IAppInfo[] = [];

export const setAppList = (list: IAppInfo[]) => {
  appList = list;
  appList.map((app) => {
    (app as IInternalAppInfo).status = AppStatus.NOT_LOADED;
  });
};

export const getAppList = () => {
  return appList;
};
