import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

let app;

export const bootstrap = () => {
  console.log("sub app bootstrap");
  app = new Vue({
    render: (h) => h(App),
  });
};

export const mount = () => {
  console.log("sub app mount");
  app.$mount("#app");
};

export const unmount = () => {
  console.log("sub app unmount");
  app.$destroy();
};
