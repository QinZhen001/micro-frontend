import { match } from "path-to-regexp";
import { getAppList } from "./appList";
import { IInternalAppInfo, AppStatus } from "./declare/index";
import { getCache, setCache } from "./cache";
import { importEntry } from "import-html-entry";

export const getAppListStatus = () => {
  const actives: IInternalAppInfo[] = [];
  const unmounts: IInternalAppInfo[] = [];

  const list = getAppList() as IInternalAppInfo[];

  list.forEach((app) => {
    const isActive = match(app.activeRule, { end: false })(location.pathname);
    switch (app.status) {
      case AppStatus.NOT_LOADED:
      case AppStatus.LOADING:
      case AppStatus.LOADED:
      case AppStatus.BOOTSTRAPPING:
      case AppStatus.NOT_MOUNTED:
        isActive && actives.push(app);
        break;
      case AppStatus.MOUNTED:
        !isActive && unmounts.push(app);
        break;
    }
  });

  return {
    actives,
    unmounts,
  };
};

export const fetchResource = async (url: string, appName: string) => {
  const res = getCache(appName, url);
  if (res) {
    return res;
  }
  const data = await fetch(url).then(async (res) => await res.text());
  // console.log("data", data);
  // debugger;
  setCache(appName, url, data);
  return data;
};

export function getCompletionURL(src: string | null, baseURI: string) {
  if (!src) {
    return src;
  }
  if (/^(https|http)/.test(src)) return src;

  return new URL(src, getCompletionBaseURL(baseURI)).toString();
}

export function getCompletionBaseURL(url: string) {
  return url.startsWith("//") ? `${location.protocol}${url}` : url;
}

export const prefetch = async (app: IInternalAppInfo) => {
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(app.entry);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
};
