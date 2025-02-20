"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isShaking: false,
      isOpen: false,
      diceOpacity: 0,
      dices: [1, 1, 1, 1, 1],
      touchStartY: 0,
      currentY: 0,
      slideY: 0,
      diceStyles: Array(5).fill().map(() => ({
        transform: "rotate3d(0, 0, 0, 0deg)",
        transition: "transform 0.3s"
      }))
    };
  },
  methods: {
    async startShake() {
      if (this.isShaking)
        return;
      this.isShaking = true;
      this.isOpen = false;
      this.diceOpacity = 0;
      this.slideY = 0;
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      this.isShaking = false;
      this.dices = Array(5).fill().map(() => Math.ceil(Math.random() * 6));
      this.animateSlide(-240);
    },
    handleTouchStart(e) {
      if (this.isShaking)
        return;
      this.touchStartY = e.touches[0].clientY;
      this.currentY = this.slideY;
    },
    handleTouchMove(e) {
      if (this.isShaking)
        return;
      const deltaY = e.touches[0].clientY - this.touchStartY;
      let newY = this.currentY + deltaY;
      newY = Math.max(-240, Math.min(0, newY));
      this.slideY = newY;
      this.diceOpacity = Math.abs(newY) / 240;
      this.updateDiceRotation(newY);
    },
    handleTouchEnd() {
      if (this.isShaking)
        return;
      if (this.slideY > -120) {
        this.animateSlide(0);
      } else {
        this.animateSlide(-240);
      }
    },
    animateSlide(target) {
      this.slideY = target;
      this.isOpen = target === -240;
      this.diceOpacity = Math.abs(target) / 240;
      this.updateDiceRotation(target);
    },
    updateDiceRotation(slideY) {
      const progress = Math.abs(slideY) / 240;
      this.diceStyles = this.diceStyles.map((_, index) => ({
        transform: `rotate3d(
          ${Math.sin(index * 1.2)}, 
          ${Math.cos(index * 1.2)}, 
          1, 
          ${progress * 360}deg
        )`,
        transition: "transform 0.3s"
      }));
    },
    isDotActive(number, position) {
      var _a;
      const dotMap = {
        1: [5],
        2: [1, 9],
        3: [1, 5, 9],
        4: [1, 3, 7, 9],
        5: [1, 3, 5, 7, 9],
        6: [1, 3, 4, 6, 7, 9]
      };
      return ((_a = dotMap[number]) == null ? void 0 : _a.includes(position)) || false;
    },
    createPhysics() {
      const engine = common_vendor.matterExports.Engine.create();
      const world = engine.world;
      common_vendor.matterExports.World.add(world, [
        common_vendor.matterExports.Bodies.rectangle(200, 610, 400, 20, { isStatic: true })
        // ...其他边界
      ]);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.startShake && $options.startShake(...args)),
    b: common_vendor.t($data.isOpen ? "↓ 向下滑动关闭" : "↑ 向上滑动打开"),
    c: $data.isOpen ? 1 : "",
    d: $data.isShaking ? 1 : "",
    e: `translateX(-50%) translateY(${$data.slideY}rpx)`,
    f: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    g: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    h: common_vendor.o((...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args)),
    i: common_vendor.f($data.dices, (dice, index, i0) => {
      return {
        a: common_vendor.f(9, (n, k1, i1) => {
          return {
            a: n,
            b: $options.isDotActive(dice, n) ? 1 : ""
          };
        }),
        b: index,
        c: common_vendor.s($data.diceStyles[index])
      };
    }),
    j: $data.diceOpacity
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6143a07f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/drinking-dice/index.js.map
