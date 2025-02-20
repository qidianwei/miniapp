"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const rotation = common_vendor.ref(0);
    let prevRotation = 0;
    const formattedDegree = common_vendor.ref("0°");
    let compassListener = null;
    const handleOrientation = (res) => {
      let newRotation = res.direction % 360;
      let delta = newRotation - prevRotation;
      if (Math.abs(delta) > 180) {
        newRotation += delta > 0 ? -360 : 360;
      }
      prevRotation = newRotation;
      rotation.value = newRotation;
      formattedDegree.value = `${Math.round(res.direction)}°`;
    };
    common_vendor.onMounted(() => {
      if (typeof common_vendor.wx$1 !== "undefined" && common_vendor.wx$1.onCompassChange) {
        common_vendor.wx$1.startCompass();
        compassListener = common_vendor.wx$1.onCompassChange(handleOrientation);
      } else if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
          if (e.webkitCompassHeading) {
            handleOrientation({ direction: e.webkitCompassHeading });
          } else if (e.alpha) {
            handleOrientation({ direction: 360 - e.alpha });
          }
        }, true);
      } else {
        common_vendor.index.showToast({
          title: "您的设备不支持指南针",
          icon: "none"
        });
      }
    });
    common_vendor.onUnmounted(() => {
      if (compassListener) {
        compassListener.stop();
        common_vendor.wx$1.stopCompass();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: `rotate(${-rotation.value}deg)`,
        b: common_vendor.t(formattedDegree.value)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-907540bd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/compass/index.js.map
