"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "CustomPopup",
  setup(__props, { expose: __expose }) {
    const visible = common_vendor.ref(false);
    const open = () => {
      visible.value = true;
    };
    const close = () => {
      visible.value = false;
    };
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: visible.value
      }, visible.value ? {
        b: common_vendor.o(close)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-245eb4bb"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/CustomPopup.js.map
