<template>
  <view class="container">
    <!-- 类型选择 -->
    <view class="form-group">
      <text class="label">换算类型</text>
      <picker class="picker" :range="types" range-key="name" @change="onTypeChange">
        <view class="picker-content">{{ types[selectedType].name }}</view>
      </picker>
    </view>

    <!-- 输入区域 -->
    <view class="input-group">
      <input class="input" type="number" v-model="inputValue" placeholder="输入数值" />
      <picker class="unit-picker" :range="currentUnits" @change="(e) => fromUnit = e.detail.value">
        <view class="picker-content">{{ currentUnits[fromUnit] }}</view>
      </picker>
    </view>

    <!-- 转换箭头 -->
    <view class="arrow">→</view>

    <!-- 输出区域 -->
    <view class="input-group">
      <input class="input result" :value="result" placeholder="结果" disabled />
      <picker class="unit-picker" :range="currentUnits" @change="(e) => toUnit = e.detail.value">
        <view class="picker-content">{{ currentUnits[toUnit] }}</view>
      </picker>
    </view>

    <!-- 公式说明 -->
    <view class="formula-card">
      <text class="formula-title">转换公式</text>
      <text class="formula-text">{{ formulaDescription }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const types = [
  {
    name: '长度',
    units: ['米', '千米', '厘米', '毫米', '英尺', '英寸'],
    conversions: {
      toStandard: {
        '千米': v => v * 1000,
        '米': v => v,
        '厘米': v => v / 100,
        '毫米': v => v / 1000,
        '英尺': v => v * 0.3048,
        '英寸': v => v * 0.0254
      },
      fromStandard: {
        '米': v => v,
        '千米': v => v / 1000,
        '厘米': v => v * 100,
        '毫米': v => v * 1000,
        '英尺': v => v / 0.3048,
        '英寸': v => v / 0.0254
      }
    }
  },
  {
    name: '温度',
    units: ['摄氏度', '华氏度'],
    conversions: {
      direct: {
        '摄氏度→华氏度': v => v * 9/5 + 32,
        '华氏度→摄氏度': v => (v - 32) * 5/9
      }
    }
  },
  {
    name: '重量',
    units: ['千克', '克', '毫克', '磅', '盎司'],
    conversions: {
      toStandard: {
        '千克': v => v,
        '克': v => v / 1000,
        '毫克': v => v / 1e6,
        '磅': v => v * 0.453592,
        '盎司': v => v * 0.0283495
      },
      fromStandard: {
        '千克': v => v,
        '克': v => v * 1000,
        '毫克': v => v * 1e6,
        '磅': v => v / 0.453592,
        '盎司': v => v / 0.0283495
      }
    }
  },
  {
    name: '面积',
    units: ['平方米', '平方千米', '公顷', '平方英尺', '平方英里'],
    conversions: {
      toStandard: {
        '平方米': v => v,
        '平方千米': v => v * 1e6,
        '公顷': v => v * 10000,
        '平方英尺': v => v * 0.092903,
        '平方英里': v => v * 2589988.11
      },
      fromStandard: {
        '平方米': v => v,
        '平方千米': v => v / 1e6,
        '公顷': v => v / 10000,
        '平方英尺': v => v / 0.092903,
        '平方英里': v => v / 2589988.11
      }
    }
  },
  {
    name: '体积',
    units: ['立方米', '升', '毫升', '加仑(美)', '立方英尺'],
    conversions: {
      toStandard: {
        '立方米': v => v,
        '升': v => v / 1000,
        '毫升': v => v / 1e6,
        '加仑(美)': v => v * 3.78541,
        '立方英尺': v => v * 0.0283168
      },
      fromStandard: {
        '立方米': v => v,
        '升': v => v * 1000,
        '毫升': v => v * 1e6,
        '加仑(美)': v => v / 3.78541,
        '立方英尺': v => v / 0.0283168
      }
    }
  },
  {
    name: '速度',
    units: ['米/秒', '千米/小时', '英里/小时', '节'],
    conversions: {
      toStandard: {
        '米/秒': v => v,
        '千米/小时': v => v / 3.6,
        '英里/小时': v => v * 0.44704,
        '节': v => v * 0.514444
      },
      fromStandard: {
        '米/秒': v => v,
        '千米/小时': v => v * 3.6,
        '英里/小时': v => v / 0.44704,
        '节': v => v / 0.514444
      }
    }
  }
]

const selectedType = ref(0)
const inputValue = ref('')
const fromUnit = ref(0)
const toUnit = ref(1)

const currentType = computed(() => types[selectedType.value])
const currentUnits = computed(() => currentType.value.units)

const result = computed(() => {
  if (!inputValue.value) return ''
  const value = parseFloat(inputValue.value)
  
  if (currentType.value.name === '温度') {
    const conversionKey = `${currentUnits.value[fromUnit.value]}→${currentUnits.value[toUnit.value]}`
    return currentType.value.conversions.direct[conversionKey](value).toFixed(2)
  }
  
  const standard = currentType.value.conversions.toStandard[currentUnits.value[fromUnit.value]](value)
  return currentType.value.conversions.fromStandard[currentUnits.value[toUnit.value]](standard).toFixed(2)
})

const formulaDescription = computed(() => {
  if (currentType.value.name === '温度') {
    return '摄氏度 → 华氏度：℉ = ℃ × 9/5 + 32\n华氏度 → 摄氏度：℃ = (℉ - 32) × 5/9'
  }
  return `1 ${currentUnits.value[fromUnit.value]} = ${currentType.value.conversions.toStandard[currentUnits.value[fromUnit.value]](1)} 标准单位`
})

const onTypeChange = (e) => {
  selectedType.value = e.detail.value
  fromUnit.value = 0
  toUnit.value = 1
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f5f7;
  min-height: 100vh;
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 13px;
  color: #86868b;
  margin-bottom: 8px;
}

.picker {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  font-size: 17px;
  border: 1px solid #e5e5ea;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  font-size: 17px;
  border: 1px solid #e5e5ea;
}

.input.result {
  background-color: #f5f5f7;
  font-weight: 600;
  color: #1d1d1f;
}

.unit-picker {
  width: 100px;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e5e5ea;
  text-align: center;
}

.arrow {
  text-align: center;
  font-size: 24px;
  color: #86868b;
  margin: 15px 0;
}

.formula-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid #e5e5ea;
}

.formula-title {
  display: block;
  font-size: 13px;
  color: #86868b;
  margin-bottom: 8px;
}

.formula-text {
  font-size: 15px;
  color: #1d1d1f;
  white-space: pre-line;
}

.picker-content {
  color: #1d1d1f;
}
</style> 