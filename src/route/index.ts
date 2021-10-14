import { EventType } from "../declare/index";

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

export const reroute = (url: string) => {};
