<template>
  <view class="container">
    <!-- 随机文本框 -->
    <view class="random-box" @click="toggleSpin">
      <text class="random-text">{{ displayText }}</text>
    </view>

    <!-- 控制按钮 -->
    <view class="control-buttons">
      <button class="start-button" @click="toggleSpin">
        {{ isSpinning ? '停止' : '开始' }}
      </button>
    </view>

    <!-- 配置面板 -->
    <view class="config-panel">
      <view class="option-list">
        <view v-for="(option, index) in options" :key="index" class="option-item">
          <input
            v-model="options[index]"
            placeholder="输入选项"
            class="option-input"
            maxlength="20"
            @input="handleInput($event, index)"
            :data-counter="`${options[index].length}/20`"
          />
          <button 
            v-if="options.length > 2"
            class="delete-btn"
            @click="removeOption(index)"
          >×</button>
        </view>
      </view>
      <view class="action-buttons">
        <button 
          class="add-btn" 
          :class="{
            'warning': options.length >= 10 && options.length < 15,
            'caution': options.length >= 15 && options.length < 20,
            'disabled': options.length >= 20
          }"
          @click="addOption"
          :disabled="options.length >= 20"
        >
          + 添加选项
          <text v-if="options.length >= 15" class="tip-text">
            (最多20个)
          </text>
        </button>
        <button
          class="remove-btn"
          :class="{
            'disabled': options.length <= 2
          }"
          @click="removeLastOption"
          :disabled="options.length <= 2"
        >- 移除选项</button>
      </view>
    </view>

    <!-- 结果弹窗 -->
    <CustomPopup ref="resultPopup">
      <view class="result-content">
        <view class="result-body">
          <text class="result-label">抽签结果</text>
          <text class="result-text">{{ result }}</text>
        </view>
      </view>
    </CustomPopup>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useDecision } from './useDecision.js'
import CustomPopup from '@/components/CustomPopup.vue'

// 状态管理
const options = ref(['选项1', '选项2', '选项3', '选项4'])
const result = ref('')
const resultPopup = ref(null)
const showPopup = ref(false)

// 抽签逻辑
const { 
  displayText,
  isSpinning,
  toggleSpin
} = useDecision(options, (selected) => {
  result.value = selected
  showPopup.value = true
  nextTick(() => {
    resultPopup.value?.open()
  })
})

// 生命周期
onMounted(async () => {
  try {
    console.log('组件加载完成')
  } catch (error) {
    console.error('初始化失败:', error)
    uni.showModal({
      title: '初始化失败',
      content: '请检查配置后重试',
      showCancel: false
    })
  }
})

// 选项管理
function addOption() {
  if (options.value.length < 20) {
    options.value.push(`选项${options.value.length + 1}`)
  } else {
    uni.showToast({
      title: '最多添加20个选项',
      icon: 'none',
      duration: 2000
    })
  }
}

function removeOption(index) {
  if (options.value.length > 2) {
    options.value.splice(index, 1)
  }
}

function removeLastOption() {
  if (options.value.length > 2) {
    options.value.pop()
  }
}

function handleInput(event, index) {
  const value = event.target.value.slice(0, 20)
  options.value[index] = value
  const input = event.target
  input.classList.toggle('warning', value.length >= 20)
}
</script>

<style scoped>
/* 原index.vue中的样式代码 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: #ffffff;
  padding-top: 44px;
}

.random-box {
  width: 280px;
  height: 64px;
  border-radius: 18px;
  background: #ffffff;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.random-text {
  font: 600 20px/-0.41px "SF Pro Display";
  color: #1d1d1f;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.random-text::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  border: 3px solid #007aff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  opacity: 0;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.isSpinning .random-text::after {
  opacity: 1;
}

.isSpinning .random-text {
  animation: textScale 0.8s ease-in-out infinite;
}

@keyframes textScale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.01); }
}

.random-box:active {
  transform: translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.config-panel {
  margin-top: 24px;
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.option-list {
  width: 100%;
  margin-bottom: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  position: relative;
}

.option-input {
  border: 0.5px solid #d1d1d6;
  border-radius: 10px;
  height: 44px;
  font-size: 17px;
  padding: 0 16px;
  padding-right: 80px;
  position: relative;
}

.option-input:focus {
  outline: none;
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.02);
}

.option-input::after {
  content: attr(data-counter);
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font: 500 13px/1 "SF Pro Text";
  color: #86868b;
  pointer-events: none;
  transition: color 0.2s ease;
}

.option-input.warning::after {
  color: #ff3b30;
}

.delete-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  background: #ff3b30;
  color: white;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-1px);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.add-btn, .remove-btn {
  flex: 1;
  padding: 8px 15px;
  border-radius: 12px;
  height: 44px;
  font-size: 17px;
  font-weight: 500;
  border: none;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}

.add-btn::after, .remove-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease;
}

.add-btn:active::after, .remove-btn:active::after {
  transform: translate(-50%, -50%) scale(1);
}

.add-btn {
  background: #34C759;
  color: white;
  transition: all 0.3s ease;
}

/* 10-14个选项 */
.add-btn.warning {
  background: #ff9500; /* 橙色 */
}

/* 15-19个选项 */
.add-btn.caution {
  background: #ffcc00; /* 黄色 */
  animation: pulse 1.5s infinite;
}

/* 达到20个 */
.add-btn.disabled,
.remove-btn.disabled {
  background: #8e8e93 !important; /* 系统灰色 */
  cursor: not-allowed;
}

.tip-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 4px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.remove-btn {
  background: #FF3B30;
  color: white;
}

.remove-btn:disabled {
  background: #ff7875;
  opacity: 0.6;
}
.start-button {
  margin-top: 20px;
  padding: 12px 24px;
  background: #007AFF;
  color: white;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: -0.41px;
  height: 50px;
  width: 280px;
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.start-button:active {
  transform: scale(0.96);
  background-color: #0063cc;
}

.result-content {
  padding: 24px 24px 32px;
  width: 280px;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
}

.result-body {
  padding: 12px 0;
  text-align: center;
}

.result-label {
  display: block;
  font: 400 15px/21px "SF Pro Text";
  color: #86868b;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.result-text {
  font: 600 17px/22px "SF Pro Display";
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1c1c1e;
  margin: 0 24px;
}

.add-btn:active, .remove-btn:active {
  transform: scale(0.98);
}

@media (max-width: 375px) {
  .result-content {
    width: calc(100% - 32px);
    max-width: 300px;
    margin: 0 auto;
  }
  
  .result-text {
    font-size: 18px;
  }
}

.char-counter {
  position: absolute;
  right: 40px;
  font-size: 12px;
  color: #86868b;
}

.input-counter {
  position: absolute;
  right: 50px;
  font-size: 13px;
  color: #86868b;
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-counter.warning {
  color: #ff3b30;
}
</style> 