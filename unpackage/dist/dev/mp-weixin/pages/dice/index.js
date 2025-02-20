"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isRolling: false,
      result: null,
      animationData: null,
      timer: null
    };
  },
  methods: {
    startRoll() {
      if (this.isRolling)
        return;
      this.isRolling = true;
      this.result = null;
      this.calculateResult();
      this.timer = setTimeout(() => {
        this.isRolling = false;
      }, 2e3);
    },
    calculateResult() {
      const faces = ["front", "back", "right", "left", "top", "bottom"];
      const randomIndex = Math.floor(Math.random() * faces.length);
      this.result = faces[randomIndex];
      const animation = common_vendor.wx$1.createAnimation({
        duration: 1e3,
        timingFunction: "ease-out",
        delay: 0
      });
      const x = Math.random() * 3600;
      const y = Math.random() * 3600;
      const z = Math.random() * 3600;
      animation.rotateX(x).rotateY(y).rotateZ(z).step();
      this.animationData = animation.export();
      setTimeout(() => {
        const finalAnimation = common_vendor.wx$1.createAnimation({
          duration: 1e3,
          // 1秒的调整时间
          timingFunction: "ease-out",
          delay: 0
        });
        switch (this.result) {
          case "front":
            finalAnimation.rotateX(0).rotateY(0).rotateZ(0).step();
            break;
          case "back":
            finalAnimation.rotateX(0).rotateY(180).rotateZ(0).step();
            break;
          case "right":
            finalAnimation.rotateX(0).rotateY(90).rotateZ(0).step();
            break;
          case "left":
            finalAnimation.rotateX(0).rotateY(-90).rotateZ(0).step();
            break;
          case "top":
            finalAnimation.rotateX(90).rotateY(0).rotateZ(0).step();
            break;
          case "bottom":
            finalAnimation.rotateX(-90).rotateY(0).rotateZ(0).step();
            break;
        }
        this.animationData = finalAnimation.export();
      }, 1e3);
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.animationData,
    b: common_vendor.t($data.isRolling ? "旋转中..." : "开始旋转"),
    c: common_vendor.o((...args) => $options.startRoll && $options.startRoll(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8520248a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dice/index.js.map
