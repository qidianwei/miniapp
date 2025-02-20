"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_decisionDraw_useDecision = require("./useDecision.js");
if (!Math) {
  CustomPopup();
}
const CustomPopup = () => "../../components/CustomPopup.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const options = common_vendor.ref(["选项1", "选项2", "选项3", "选项4"]);
    const result = common_vendor.ref("");
    const resultPopup = common_vendor.ref(null);
    const showPopup = common_vendor.ref(false);
    const {
      displayText,
      isSpinning,
      toggleSpin
    } = pages_decisionDraw_useDecision.useDecision(options, (selected) => {
      result.value = selected;
      showPopup.value = true;
      common_vendor.nextTick$1(() => {
        var _a;
        (_a = resultPopup.value) == null ? void 0 : _a.open();
      });
    });
    common_vendor.onMounted(async () => {
      try {
        common_vendor.index.__f__("log", "at pages/decision-draw/index.vue:100", "组件加载完成");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/decision-draw/index.vue:102", "初始化失败:", error);
        common_vendor.index.showModal({
          title: "初始化失败",
          content: "请检查配置后重试",
          showCancel: false
        });
      }
    });
    function addOption() {
      if (options.value.length < 20) {
        options.value.push(`选项${options.value.length + 1}`);
      } else {
        common_vendor.index.showToast({
          title: "最多添加20个选项",
          icon: "none",
          duration: 2e3
        });
      }
    }
    function removeOption(index) {
      if (options.value.length > 2) {
        options.value.splice(index, 1);
      }
    }
    function removeLastOption() {
      if (options.value.length > 2) {
        options.value.pop();
      }
    }
    function handleInput(event, index) {
      const value = event.target.value.slice(0, 20);
      options.value[index] = value;
      const input = event.target;
      input.classList.toggle("warning", value.length >= 20);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(displayText)),
        b: common_vendor.o((...args) => common_vendor.unref(toggleSpin) && common_vendor.unref(toggleSpin)(...args)),
        c: common_vendor.t(common_vendor.unref(isSpinning) ? "停止" : "开始"),
        d: common_vendor.o((...args) => common_vendor.unref(toggleSpin) && common_vendor.unref(toggleSpin)(...args)),
        e: common_vendor.f(options.value, (option, index, i0) => {
          return common_vendor.e({
            a: common_vendor.o([($event) => options.value[index] = $event.detail.value, index, ($event) => handleInput($event, index), index], index),
            b: `${options.value[index].length}/20`,
            c: options.value[index]
          }, options.value.length > 2 ? {
            d: common_vendor.o(($event) => removeOption(index), index)
          } : {}, {
            e: index
          });
        }),
        f: options.value.length > 2,
        g: options.value.length >= 15
      }, options.value.length >= 15 ? {} : {}, {
        h: options.value.length >= 10 && options.value.length < 15 ? 1 : "",
        i: options.value.length >= 15 && options.value.length < 20 ? 1 : "",
        j: options.value.length >= 20 ? 1 : "",
        k: common_vendor.o(addOption),
        l: options.value.length >= 20,
        m: options.value.length <= 2 ? 1 : "",
        n: common_vendor.o(removeLastOption),
        o: options.value.length <= 2,
        p: common_vendor.t(result.value),
        q: common_vendor.sr(resultPopup, "e717555a-0", {
          "k": "resultPopup"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e717555a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/decision-draw/index.js.map
