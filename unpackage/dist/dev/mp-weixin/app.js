"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/decision-draw/index.js";
  "./pages/dice/index.js";
  "./pages/calculator/index.js";
  "./pages/converter/index.js";
  "./pages/adventure/index.js";
  "./pages/truth/index.js";
  "./pages/compass/index.js";
  "./pages/timer/index.js";
  "./pages/drinking-dice/index.js";
  "./pages/personality-lab/index.js";
  "./pages/stress-bubbles/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
