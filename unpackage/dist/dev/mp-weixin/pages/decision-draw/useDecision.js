"use strict";
const common_vendor = require("../../common/vendor.js");
function useDecision(options, onResult) {
  const isSpinning = common_vendor.ref(false);
  const displayText = common_vendor.ref("点击开始");
  let intervalId = null;
  let currentIndex = 0;
  const startRandom = () => {
    if (isSpinning.value)
      return;
    isSpinning.value = true;
    intervalId = setInterval(() => {
      currentIndex = Math.floor(Math.random() * options.value.length);
      displayText.value = options.value[currentIndex] || "无选项";
    }, 50);
  };
  const stopRandom = () => {
    clearInterval(intervalId);
    isSpinning.value = false;
    onResult(options.value[currentIndex] || "");
  };
  const toggleSpin = () => {
    isSpinning.value ? stopRandom() : startRandom();
  };
  return {
    displayText,
    isSpinning,
    toggleSpin
  };
}
exports.useDecision = useDecision;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/decision-draw/useDecision.js.map
