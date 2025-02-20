"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const features = common_vendor.ref([
      { icon: "🎲", title: "随机骰子", path: "/pages/dice/index" },
      { icon: "🫧", title: "压力泡泡工厂", path: "/pages/stress-bubbles/index" },
      { icon: "🎲", title: "喝酒骰子", path: "/pages/drinking-dice/index" },
      { icon: "🚀", title: "随机大冒险", path: "/pages/adventure/index" },
      { icon: "🔬", title: "人格实验室", path: "/pages/personality-lab/index" },
      { icon: "🧭", title: "指南针", path: "/pages/compass/index" },
      { icon: "🤔", title: "决策抽签", path: "/pages/decision-draw/index" },
      { icon: "💖", title: "随机真心话", path: "/pages/truth/index" },
      { icon: "🧮", title: "计算器", path: "/pages/calculator/index" },
      { icon: "⏱️", title: "计时器", path: "/pages/timer/index" },
      { icon: "📐", title: "单位换算", path: "/pages/converter/index" }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(features.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.title),
            c: index,
            d: item.path
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
