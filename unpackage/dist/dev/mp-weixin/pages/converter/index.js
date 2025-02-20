"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const types = [
      {
        name: "长度",
        units: ["米", "千米", "厘米", "毫米", "英尺", "英寸"],
        conversions: {
          toStandard: {
            "千米": (v) => v * 1e3,
            "米": (v) => v,
            "厘米": (v) => v / 100,
            "毫米": (v) => v / 1e3,
            "英尺": (v) => v * 0.3048,
            "英寸": (v) => v * 0.0254
          },
          fromStandard: {
            "米": (v) => v,
            "千米": (v) => v / 1e3,
            "厘米": (v) => v * 100,
            "毫米": (v) => v * 1e3,
            "英尺": (v) => v / 0.3048,
            "英寸": (v) => v / 0.0254
          }
        }
      },
      {
        name: "温度",
        units: ["摄氏度", "华氏度"],
        conversions: {
          direct: {
            "摄氏度→华氏度": (v) => v * 9 / 5 + 32,
            "华氏度→摄氏度": (v) => (v - 32) * 5 / 9
          }
        }
      },
      {
        name: "重量",
        units: ["千克", "克", "毫克", "磅", "盎司"],
        conversions: {
          toStandard: {
            "千克": (v) => v,
            "克": (v) => v / 1e3,
            "毫克": (v) => v / 1e6,
            "磅": (v) => v * 0.453592,
            "盎司": (v) => v * 0.0283495
          },
          fromStandard: {
            "千克": (v) => v,
            "克": (v) => v * 1e3,
            "毫克": (v) => v * 1e6,
            "磅": (v) => v / 0.453592,
            "盎司": (v) => v / 0.0283495
          }
        }
      },
      {
        name: "面积",
        units: ["平方米", "平方千米", "公顷", "平方英尺", "平方英里"],
        conversions: {
          toStandard: {
            "平方米": (v) => v,
            "平方千米": (v) => v * 1e6,
            "公顷": (v) => v * 1e4,
            "平方英尺": (v) => v * 0.092903,
            "平方英里": (v) => v * 258998811e-2
          },
          fromStandard: {
            "平方米": (v) => v,
            "平方千米": (v) => v / 1e6,
            "公顷": (v) => v / 1e4,
            "平方英尺": (v) => v / 0.092903,
            "平方英里": (v) => v / 258998811e-2
          }
        }
      },
      {
        name: "体积",
        units: ["立方米", "升", "毫升", "加仑(美)", "立方英尺"],
        conversions: {
          toStandard: {
            "立方米": (v) => v,
            "升": (v) => v / 1e3,
            "毫升": (v) => v / 1e6,
            "加仑(美)": (v) => v * 3.78541,
            "立方英尺": (v) => v * 0.0283168
          },
          fromStandard: {
            "立方米": (v) => v,
            "升": (v) => v * 1e3,
            "毫升": (v) => v * 1e6,
            "加仑(美)": (v) => v / 3.78541,
            "立方英尺": (v) => v / 0.0283168
          }
        }
      },
      {
        name: "速度",
        units: ["米/秒", "千米/小时", "英里/小时", "节"],
        conversions: {
          toStandard: {
            "米/秒": (v) => v,
            "千米/小时": (v) => v / 3.6,
            "英里/小时": (v) => v * 0.44704,
            "节": (v) => v * 0.514444
          },
          fromStandard: {
            "米/秒": (v) => v,
            "千米/小时": (v) => v * 3.6,
            "英里/小时": (v) => v / 0.44704,
            "节": (v) => v / 0.514444
          }
        }
      }
    ];
    const selectedType = common_vendor.ref(0);
    const inputValue = common_vendor.ref("");
    const fromUnit = common_vendor.ref(0);
    const toUnit = common_vendor.ref(1);
    const currentType = common_vendor.computed(() => types[selectedType.value]);
    const currentUnits = common_vendor.computed(() => currentType.value.units);
    const result = common_vendor.computed(() => {
      if (!inputValue.value)
        return "";
      const value = parseFloat(inputValue.value);
      if (currentType.value.name === "温度") {
        const conversionKey = `${currentUnits.value[fromUnit.value]}→${currentUnits.value[toUnit.value]}`;
        return currentType.value.conversions.direct[conversionKey](value).toFixed(2);
      }
      const standard = currentType.value.conversions.toStandard[currentUnits.value[fromUnit.value]](value);
      return currentType.value.conversions.fromStandard[currentUnits.value[toUnit.value]](standard).toFixed(2);
    });
    const formulaDescription = common_vendor.computed(() => {
      if (currentType.value.name === "温度") {
        return "摄氏度 → 华氏度：℉ = ℃ × 9/5 + 32\n华氏度 → 摄氏度：℃ = (℉ - 32) × 5/9";
      }
      return `1 ${currentUnits.value[fromUnit.value]} = ${currentType.value.conversions.toStandard[currentUnits.value[fromUnit.value]](1)} 标准单位`;
    });
    const onTypeChange = (e) => {
      selectedType.value = e.detail.value;
      fromUnit.value = 0;
      toUnit.value = 1;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(types[selectedType.value].name),
        b: types,
        c: common_vendor.o(onTypeChange),
        d: inputValue.value,
        e: common_vendor.o(($event) => inputValue.value = $event.detail.value),
        f: common_vendor.t(currentUnits.value[fromUnit.value]),
        g: currentUnits.value,
        h: common_vendor.o((e) => fromUnit.value = e.detail.value),
        i: result.value,
        j: common_vendor.t(currentUnits.value[toUnit.value]),
        k: currentUnits.value,
        l: common_vendor.o((e) => toUnit.value = e.detail.value),
        m: common_vendor.t(formulaDescription.value)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c8703fb8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/converter/index.js.map
