import { EventType } from "../declare/index";
import { getAppListStatus } from "../utils";
import { runBoostrap, runBeforeLoad, runMounted, runUnmounted } from "../lifeCycle";

const capturedListeners: Record<EventType, Function[]> = {
  hashchange: [],
  popstate: [],
};

// 劫持和 history 和 hash 相关的事件和函数
// 然后我们在劫持的方法里做一些自己的事情
// 比如说在 URL 发生改变的时候判断当前是否切换了子应用

const originalPush = window.history.pushState;
const originalReplace = window.history.replaceState;

let historyEvent: PopStateEvent | null = null;

let lastUrl: string | null = null;

const handleUrlChange = () => {
  reroute(location.href);
};

const hasListeners = (name: EventType, fn: Function) => {
  return capturedListeners[name].filter((listener) => listener === fn).length;
};

export const reroute = (url: string) => {
  if (url !== lastUrl) {
    // url 发生了变化
    const { actives, unmounts } = getAppListStatus();
    Promise.all(
      unmounts
        .map(async (app) => {
          await runUnmounted(app);
        })
        .concat(
          actives.map(async (app) => {
            await runBeforeLoad(app);
            await runBoostrap(app);
            await runMounted(app);
          })
        )
    ).then(() => {
      callCapturedListeners();
    });
  }

  lastUrl = url || location.href;
};

export function callCapturedListeners() {
  if (historyEvent) {
    Object.keys(capturedListeners).forEach((eventName) => {
      const listeners = capturedListeners[eventName as EventType];
      if (listeners.length) {
        listeners.forEach((listener) => {
          // @ts-ignore
          listener.call(this, historyEvent);
        });
      }
    });
    historyEvent = null;
  }
}

export function cleanCapturedListeners() {
  capturedListeners["hashchange"] = [];
  capturedListeners["popstate"] = [];
}

export const hijackRoute = () => {
  // https://github.com/forthealllight/blog/issues/37
  // history 上的 pushState 和 replaceState 不会触发popstate事件 
  // 所以我们要劫持他们
  window.history.pushState = (...args) => {
    console.log("pushState", ...args);
    originalPush.apply(window.history, args);
    historyEvent = new PopStateEvent("popstate");
    // @ts-ignore
    args[2] && reroute(args[2]);
  };
  window.history.replaceState = (...args) => {
    console.log("replaceState", ...args);
    originalReplace.apply(window.history, args);
    historyEvent = new PopStateEvent("popstate");
    // @ts-ignore
    args[2] && reroute(args[2]);
  };

  window.addEventListener("hashchange", () => {
    console.log("hashchange");
    handleUrlChange();
  });
  window.addEventListener("popstate", () => {
    console.log("popstate");
    handleUrlChange();
  });

  window.addEventListener = hijackEventListener(window.addEventListener);
  window.removeEventListener = hijackEventListener(window.removeEventListener);
};

const hijackEventListener = (func: Function): any => {
  return function (name: string, fn: Function) {
    if (name === "hashchange" || name === "popstate") {
      if (!hasListeners(name, fn)) {
        capturedListeners[name].push(fn);
        return;
      } else {
        capturedListeners[name] = capturedListeners[name].filter((listener) => listener !== fn);
      }
    }
    return func.apply(window, arguments);
  };
};
