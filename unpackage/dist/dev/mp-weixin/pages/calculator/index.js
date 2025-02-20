"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentInput: "",
      previousInput: "",
      currentOperator: null,
      waitingForOperand: false,
      fontSize: 64
      // 初始字体大小
    };
  },
  computed: {
    formattedDisplay() {
      const maxLength = 10;
      let display = this.currentInput || "0";
      if (display.length > maxLength) {
        const num = parseFloat(display);
        if (!isNaN(num)) {
          return num.toExponential(4);
        }
      }
      return display;
    }
  },
  watch: {
    currentInput(newVal) {
      const baseSize = 64;
      const minSize = 32;
      const length = newVal.length;
      if (length <= 6) {
        this.fontSize = baseSize;
      } else if (length <= 8) {
        this.fontSize = baseSize * 0.8;
      } else if (length <= 10) {
        this.fontSize = baseSize * 0.6;
      } else {
        this.fontSize = minSize;
      }
    }
  },
  methods: {
    inputNumber(number) {
      if (this.waitingForOperand) {
        this.currentInput = number;
        this.waitingForOperand = false;
      } else {
        this.currentInput = this.currentInput === "0" ? number : this.currentInput + number;
      }
    },
    operator(op) {
      if (this.currentOperator && !this.waitingForOperand) {
        this.calculate();
      }
      this.previousInput = this.currentInput;
      this.currentOperator = op;
      this.waitingForOperand = true;
    },
    calculate() {
      const prev = parseFloat(this.previousInput);
      const current = parseFloat(this.currentInput);
      if (isNaN(prev) || isNaN(current)) {
        this.currentInput = "0";
        return;
      }
      let result;
      switch (this.currentOperator) {
        case "+":
          result = prev + current;
          break;
        case "-":
          result = prev - current;
          break;
        case "*":
          result = prev * current;
          break;
        case "/":
          result = prev / current;
          break;
        default:
          return;
      }
      if (!isFinite(result)) {
        this.currentInput = "Error";
      } else {
        this.currentInput = String(result);
      }
      this.previousInput = "";
      this.currentOperator = null;
      this.waitingForOperand = true;
    },
    clear() {
      this.currentInput = "0";
      this.previousInput = "";
      this.currentOperator = null;
    },
    toggleSign() {
      if (!this.currentInput)
        return;
      const num = parseFloat(this.currentInput);
      if (isNaN(num))
        return;
      this.currentInput = String(-num);
    },
    percent() {
      if (!this.currentInput)
        return;
      const num = parseFloat(this.currentInput);
      if (isNaN(num))
        return;
      this.currentInput = String(num / 100);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.formattedDisplay),
    b: $data.fontSize + "px",
    c: common_vendor.o((...args) => $options.clear && $options.clear(...args)),
    d: common_vendor.o((...args) => $options.toggleSign && $options.toggleSign(...args)),
    e: common_vendor.o((...args) => $options.percent && $options.percent(...args)),
    f: common_vendor.o(($event) => $options.operator("/")),
    g: common_vendor.o(($event) => $options.inputNumber("7")),
    h: common_vendor.o(($event) => $options.inputNumber("8")),
    i: common_vendor.o(($event) => $options.inputNumber("9")),
    j: common_vendor.o(($event) => $options.operator("*")),
    k: common_vendor.o(($event) => $options.inputNumber("4")),
    l: common_vendor.o(($event) => $options.inputNumber("5")),
    m: common_vendor.o(($event) => $options.inputNumber("6")),
    n: common_vendor.o(($event) => $options.operator("-")),
    o: common_vendor.o(($event) => $options.inputNumber("1")),
    p: common_vendor.o(($event) => $options.inputNumber("2")),
    q: common_vendor.o(($event) => $options.inputNumber("3")),
    r: common_vendor.o(($event) => $options.operator("+")),
    s: common_vendor.o(($event) => $options.inputNumber("0")),
    t: common_vendor.o(($event) => $options.inputNumber(".")),
    v: common_vendor.o((...args) => $options.calculate && $options.calculate(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0b43ee93"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/calculator/index.js.map
