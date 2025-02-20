"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const totalSeconds = common_vendor.ref(0);
    const isCounting = common_vendor.ref(false);
    const timeSelection = common_vendor.ref([0, 0, 0]);
    const formattedTime = common_vendor.ref("00:00:00");
    let timer = null;
    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = seconds % 60;
      return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
    };
    const timeChange = (e) => {
      timeSelection.value = e.detail.value;
      const [h, m, s] = e.detail.value.map((v) => {
        const num = parseInt(v);
        return isNaN(num) ? 0 : num;
      });
      totalSeconds.value = h * 3600 + m * 60 + s;
      formattedTime.value = formatTime(totalSeconds.value);
    };
    const toggleTimer = () => {
      if (totalSeconds.value <= 0)
        return;
      isCounting.value = !isCounting.value;
      if (isCounting.value) {
        timer = setInterval(() => {
          if (totalSeconds.value > 0) {
            totalSeconds.value--;
            formattedTime.value = formatTime(totalSeconds.value);
          } else {
            clearInterval(timer);
            isCounting.value = false;
            common_vendor.index.showToast({
              title: "时间到！",
              icon: "none"
            });
          }
        }, 1e3);
      } else {
        clearInterval(timer);
      }
    };
    const resetTimer = () => {
      clearInterval(timer);
      isCounting.value = false;
      totalSeconds.value = 0;
      timeSelection.value = [0, 0, 0];
      formattedTime.value = "00:00:00";
    };
    common_vendor.onUnmounted(() => {
      clearInterval(timer);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formattedTime.value),
        b: common_vendor.t(isCounting.value ? "暂停" : "开始"),
        c: isCounting.value ? 1 : "",
        d: totalSeconds.value <= 0 ? 1 : "",
        e: common_vendor.o(toggleTimer),
        f: common_vendor.o(resetTimer),
        g: common_vendor.f(24, (h, k0, i0) => {
          return {
            a: common_vendor.t(h - 1),
            b: h,
            c: common_vendor.s(h === 1 ? "color: #ff3b30" : "")
          };
        }),
        h: common_vendor.f(60, (m, k0, i0) => {
          return {
            a: common_vendor.t(m - 1),
            b: m,
            c: common_vendor.s(m === 1 ? "color: #ff3b30" : "")
          };
        }),
        i: common_vendor.f(60, (s, k0, i0) => {
          return {
            a: common_vendor.t(s - 1),
            b: s,
            c: common_vendor.s(s === 1 ? "color: #ff3b30" : "")
          };
        }),
        j: timeSelection.value,
        k: common_vendor.o(timeChange)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-706ada7f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/timer/index.js.map
